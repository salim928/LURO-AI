import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, Lasso
from sklearn.svm import SVC, SVR
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_squared_error, r2_score, classification_report
from sklearn.model_selection import GridSearchCV, cross_val_score
import xgboost as xgb
from .base_agent import BaseAgent, AgentInput, AgentResult
import joblib
import warnings
warnings.filterwarnings('ignore')

class ModelTrainingAgent(BaseAgent):
    """Agent responsible for training and evaluating machine learning models"""
    
    def __init__(self):
        super().__init__("ModelTrainingAgent")
        self.trained_models = {}
        self.best_model = None
        self.model_performance = {}
        
    def validate_input(self, input_data: AgentInput) -> bool:
        """Validate input data for model training"""
        if not isinstance(input_data.data, pd.DataFrame):
            return False
        
        if input_data.data.empty:
            return False
        
        # Need target column for supervised learning
        metadata = None
        if input_data.previous_results:
            for result in input_data.previous_results:
                if result.agent_name == 'PreprocessingAgent' and result.metadata:
                    metadata = result.metadata
                    break
        
        if not metadata or not metadata.get('target_column'):
            return False
        
        return True
    
    def process(self, input_data: AgentInput) -> AgentResult:
        """Train and evaluate machine learning models"""
        try:
            df = input_data.data.copy()
            query = input_data.context.get('query', '')
            
            self.log_processing_start(input_data)
            
            # Get preprocessing metadata
            preprocessing_metadata = self._get_preprocessing_metadata(input_data.previous_results)
            target_column = preprocessing_metadata.get('target_column')
            test_data = preprocessing_metadata.get('test_data')
            
            if not target_column or target_column not in df.columns:
                raise ValueError(f"Target column {target_column} not found in data")
            
            # Separate features and target
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            # Determine problem type
            is_classification = self._is_classification_problem(y)
            
            # Get test data if available
            X_test, y_test = None, None
            if test_data is not None and isinstance(test_data, pd.DataFrame):
                if target_column in test_data.columns:
                    X_test = test_data.drop(columns=[target_column])
                    y_test = test_data[target_column]
            
            # Train multiple models
            models_to_train = self._get_model_candidates(is_classification)
            
            # Train and evaluate each model
            model_results = {}
            for model_name, model in models_to_train.items():
                try:
                    # Train model
                    trained_model = self._train_model(model, X, y, model_name)
                    
                    # Evaluate model
                    if X_test is not None and y_test is not None:
                        # Use test set for evaluation
                        performance = self._evaluate_model(trained_model, X_test, y_test, is_classification)
                    else:
                        # Use cross-validation for evaluation
                        performance = self._cross_validate_model(trained_model, X, y, is_classification)
                    
                    model_results[model_name] = {
                        'model': trained_model,
                        'performance': performance,
                        'feature_importance': self._get_feature_importance(trained_model, X.columns)
                    }
                    
                    self.trained_models[model_name] = trained_model
                    
                except Exception as e:
                    self.logger.warning(f"Failed to train {model_name}: {e}")
                    continue
            
            if not model_results:
                raise ValueError("No models were successfully trained")
            
            # Select best model
            best_model_name = self._select_best_model(model_results, is_classification)
            self.best_model = model_results[best_model_name]['model']
            
            # Generate predictions with best model
            predictions = None
            if X_test is not None:
                predictions = self.best_model.predict(X_test)
            
            # Create model interpretation
            model_interpretation = self._interpret_best_model(
                best_model_name, 
                model_results[best_model_name], 
                X.columns,
                is_classification
            )
            
            # Generate insights
            insights = self._generate_modeling_insights(
                model_results, 
                best_model_name, 
                is_classification,
                query
            )
            
            result = AgentResult(
                agent_name=self.name,
                success=True,
                data=df,  # Return original data
                metadata={
                    'problem_type': 'classification' if is_classification else 'regression',
                    'target_column': target_column,
                    'best_model': best_model_name,
                    'model_performance': model_results[best_model_name]['performance'],
                    'all_model_results': {k: v['performance'] for k, v in model_results.items()},
                    'feature_importance': model_results[best_model_name]['feature_importance'],
                    'model_interpretation': model_interpretation,
                    'predictions': predictions.tolist() if predictions is not None else None,
                    'insights': insights,
                    'models_trained': len(model_results),
                    'training_summary': self._create_training_summary(model_results)
                }
            )
            
            self.log_processing_end(result)
            return result
            
        except Exception as e:
            return self.handle_error(e, input_data)

    def _get_preprocessing_metadata(self, previous_results: List) -> Dict[str, Any]:
        """Extract preprocessing metadata from previous agent results"""
        for result in previous_results:
            if result.agent_name == 'PreprocessingAgent' and result.metadata:
                return result.metadata
        return {}

    def _is_classification_problem(self, y: pd.Series) -> bool:
        """Determine if this is a classification or regression problem"""
        if y.dtype == 'object':
            return True
        
        unique_count = y.nunique()
        total_count = len(y)
        
        # If unique values are less than 5% of total and <= 20 unique values
        return (unique_count / total_count < 0.05) and (unique_count <= 20)

    def _get_model_candidates(self, is_classification: bool) -> Dict[str, Any]:
        """Get appropriate model candidates based on problem type"""
        if is_classification:
            return {
                'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingClassifier(random_state=42),
                'xgboost': xgb.XGBClassifier(random_state=42, eval_metric='logloss'),
                'logistic_regression': LogisticRegression(random_state=42, max_iter=1000)
            }
        else:
            return {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingRegressor(random_state=42),
                'xgboost': xgb.XGBRegressor(random_state=42),
                'linear_regression': LinearRegression(),
                'ridge': Ridge(alpha=1.0, random_state=42)
            }

    def _train_model(self, model, X: pd.DataFrame, y: pd.Series, model_name: str) -> Any:
        """Train a single model with basic hyperparameter tuning"""
        try:
            # Define parameter grids for tuning
            param_grids = {
                'random_forest': {
                    'n_estimators': [50, 100],
                    'max_depth': [None, 10, 20],
                    'min_samples_split': [2, 5]
                },
                'gradient_boosting': {
                    'n_estimators': [50, 100],
                    'max_depth': [3, 5, 7],
                    'learning_rate': [0.1, 0.01]
                },
                'xgboost': {
                    'n_estimators': [50, 100],
                    'max_depth': [3, 6],
                    'learning_rate': [0.1, 0.01]
                }
            }
            
            # Use grid search if parameter grid exists and dataset is not too large
            if model_name in param_grids and len(X) < 10000:
                scoring = 'accuracy' if self._is_classification_problem(y) else 'r2'
                grid_search = GridSearchCV(
                    model, 
                    param_grids[model_name], 
                    cv=3, 
                    scoring=scoring,
                    n_jobs=-1
                )
                grid_search.fit(X, y)
                return grid_search.best_estimator_
            else:
                # Simple training without hyperparameter tuning
                model.fit(X, y)
                return model
                
        except Exception as e:
            # Fallback to simple training if grid search fails
            self.logger.warning(f"Grid search failed for {model_name}, using default parameters: {e}")
            model.fit(X, y)
            return model

    def _evaluate_model(self, model, X_test: pd.DataFrame, y_test: pd.Series, is_classification: bool) -> Dict[str, float]:
        """Evaluate model performance on test set"""
        try:
            predictions = model.predict(X_test)
            
            if is_classification:
                accuracy = accuracy_score(y_test, predictions)
                precision = precision_score(y_test, predictions, average='weighted', zero_division=0)
                recall = recall_score(y_test, predictions, average='weighted', zero_division=0)
                f1 = f1_score(y_test, predictions, average='weighted', zero_division=0)
                
                return {
                    'accuracy': round(accuracy, 4),
                    'precision': round(precision, 4),
                    'recall': round(recall, 4),
                    'f1_score': round(f1, 4),
                    'test_samples': len(y_test)
                }
            else:
                mse = mean_squared_error(y_test, predictions)
                rmse = np.sqrt(mse)
                r2 = r2_score(y_test, predictions)
                mae = np.mean(np.abs(y_test - predictions))
                
                return {
                    'r2_score': round(r2, 4),
                    'rmse': round(rmse, 4),
                    'mae': round(mae, 4),
                    'mse': round(mse, 4),
                    'test_samples': len(y_test)
                }
                
        except Exception as e:
            self.logger.error(f"Model evaluation failed: {e}")
            return {'error': str(e)}

    def _cross_validate_model(self, model, X: pd.DataFrame, y: pd.Series, is_classification: bool) -> Dict[str, float]:
        """Evaluate model using cross-validation"""
        try:
            scoring = 'accuracy' if is_classification else 'r2'
            cv_scores = cross_val_score(model, X, y, cv=5, scoring=scoring)
            
            base_metrics = {
                f'{scoring}_mean': round(cv_scores.mean(), 4),
                f'{scoring}_std': round(cv_scores.std(), 4),
                'cv_folds': 5
            }
            
            # Add additional metrics
            if is_classification:
                precision_scores = cross_val_score(model, X, y, cv=5, scoring='precision_weighted')
                recall_scores = cross_val_score(model, X, y, cv=5, scoring='recall_weighted')
                
                base_metrics.update({
                    'precision_mean': round(precision_scores.mean(), 4),
                    'recall_mean': round(recall_scores.mean(), 4)
                })
            else:
                neg_mse_scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_squared_error')
                
                base_metrics.update({
                    'rmse_mean': round(np.sqrt(-neg_mse_scores.mean()), 4),
                    'rmse_std': round(np.sqrt(-neg_mse_scores).std(), 4)
                })
            
            return base_metrics
            
        except Exception as e:
            self.logger.error(f"Cross-validation failed: {e}")
            return {'error': str(e)}

    def _get_feature_importance(self, model, feature_names: pd.Index) -> Dict[str, float]:
        """Extract feature importance from trained model"""
        try:
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
            elif hasattr(model, 'coef_'):
                importances = np.abs(model.coef_).flatten()
            else:
                return {}
            
            # Create feature importance dictionary
            feature_importance = dict(zip(feature_names, importances))
            
            # Sort by importance and return top 20
            sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
            return dict(sorted_features[:20])
            
        except Exception as e:
            self.logger.warning(f"Could not extract feature importance: {e}")
            return {}

    def _select_best_model(self, model_results: Dict[str, Dict], is_classification: bool) -> str:
        """Select the best performing model"""
        if is_classification:
            # Use accuracy for classification, fallback to f1_score
            best_score = -1
            best_model = None
            
            for model_name, results in model_results.items():
                perf = results['performance']
                score = perf.get('accuracy', perf.get('accuracy_mean', perf.get('f1_score', 0)))
                
                if score > best_score:
                    best_score = score
                    best_model = model_name
        else:
            # Use R2 score for regression
            best_score = -np.inf
            best_model = None
            
            for model_name, results in model_results.items():
                perf = results['performance']
                score = perf.get('r2_score', perf.get('r2_score_mean', -np.inf))
                
                if score > best_score:
                    best_score = score
                    best_model = model_name
        
        return best_model if best_model else list(model_results.keys())[0]

    def _interpret_best_model(
        self, 
        model_name: str, 
        model_result: Dict, 
        feature_names: pd.Index,
        is_classification: bool
    ) -> Dict[str, Any]:
        """Generate interpretation of the best model"""
        interpretation = {
            'model_type': model_name,
            'problem_type': 'classification' if is_classification else 'regression',
            'performance_summary': self._summarize_performance(model_result['performance'], is_classification),
            'top_features': list(model_result['feature_importance'].keys())[:5],
            'feature_importance_interpretation': self._interpret_feature_importance(model_result['feature_importance']),
            'business_implications': self._generate_business_implications(model_name, model_result, is_classification)
        }
        
        return interpretation

    def _summarize_performance(self, performance: Dict, is_classification: bool) -> str:
        """Create human-readable performance summary"""
        if is_classification:
            accuracy = performance.get('accuracy', performance.get('accuracy_mean', 0))
            precision = performance.get('precision', performance.get('precision_mean', 0))
            
            if accuracy >= 0.9:
                quality = "excellent"
            elif accuracy >= 0.8:
                quality = "good"
            elif accuracy >= 0.7:
                quality = "moderate"
            else:
                quality = "needs improvement"
            
            return f"Model achieves {quality} performance with {accuracy:.1%} accuracy and {precision:.1%} precision"
        else:
            r2 = performance.get('r2_score', performance.get('r2_score_mean', 0))
            rmse = performance.get('rmse', performance.get('rmse_mean', 0))
            
            if r2 >= 0.8:
                quality = "excellent"
            elif r2 >= 0.6:
                quality = "good"
            elif r2 >= 0.4:
                quality = "moderate"
            else:
                quality = "needs improvement"
            
            return f"Model explains {r2:.1%} of variance with {quality} predictive performance (RMSE: {rmse:.2f})"

    def _interpret_feature_importance(self, feature_importance: Dict[str, float]) -> List[str]:
        """Generate interpretations of feature importance"""
        interpretations = []
        
        if not feature_importance:
            return ["Feature importance could not be determined for this model type"]
        
        # Get top features
        sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        
        if len(sorted_features) >= 3:
            top_3 = sorted_features[:3]
            interpretations.append(f"Top 3 most important features: {', '.join([f[0] for f in top_3])}")
            
            # Calculate relative importance
            total_importance = sum(feature_importance.values())
            top_feature_pct = (top_3[0][1] / total_importance) * 100
            
            if top_feature_pct > 50:
                interpretations.append(f"Model heavily relies on '{top_3[0][0]}' ({top_feature_pct:.1f}% of total importance)")
            else:
                interpretations.append(f"Model uses a balanced combination of features (top feature: {top_feature_pct:.1f}%)")
        
        return interpretations

    def _generate_business_implications(self, model_name: str, model_result: Dict, is_classification: bool) -> List[str]:
        """Generate business implications from model results"""
        implications = []
        
        # Model type implications
        if 'tree' in model_name.lower() or 'forest' in model_name.lower():
            implications.append("Tree-based model provides interpretable decision rules")
        elif 'linear' in model_name.lower() or 'logistic' in model_name.lower():
            implications.append("Linear model offers clear feature relationships and fast predictions")
        elif 'xgb' in model_name.lower() or 'gradient' in model_name.lower():
            implications.append("Gradient boosting model optimized for predictive accuracy")
        
        # Performance implications
        performance = model_result['performance']
        
        if is_classification:
            accuracy = performance.get('accuracy', performance.get('accuracy_mean', 0))
            
            if accuracy > 0.85:
                implications.append("High accuracy suitable for automated decision making")
            elif accuracy > 0.7:
                implications.append("Good accuracy for decision support with human oversight")
            else:
                implications.append("Model needs improvement before production use")
        else:
            r2 = performance.get('r2_score', performance.get('r2_score_mean', 0))
            
            if r2 > 0.8:
                implications.append("Strong predictive power suitable for forecasting and planning")
            elif r2 > 0.6:
                implications.append("Moderate predictive power useful for trend analysis")
            else:
                implications.append("Limited predictive power - consider as exploratory tool only")
        
        # Feature importance implications
        feature_importance = model_result['feature_importance']
        if feature_importance:
            top_feature = list(feature_importance.keys())[0]
            implications.append(f"Focus business efforts on optimizing '{top_feature}' for maximum impact")
        
        return implications

    def _generate_modeling_insights(
        self, 
        model_results: Dict[str, Dict], 
        best_model_name: str,
        is_classification: bool,
        query: str
    ) -> List[str]:
        """Generate insights from the modeling process"""
        insights = []
        
        # Model comparison insight
        insights.append(f"Trained {len(model_results)} models, with {best_model_name} performing best")
        
        # Performance insight
        best_performance = model_results[best_model_name]['performance']
        if is_classification:
            accuracy = best_performance.get('accuracy', best_performance.get('accuracy_mean', 0))
            insights.append(f"Best model achieves {accuracy:.1%} accuracy on the prediction task")
        else:
            r2 = best_performance.get('r2_score', best_performance.get('r2_score_mean', 0))
            insights.append(f"Best model explains {r2:.1%} of variance in the target variable")
        
        # Feature importance insight
        feature_importance = model_results[best_model_name]['feature_importance']
        if feature_importance:
            top_features = list(feature_importance.keys())[:3]
            insights.append(f"Most predictive factors: {', '.join(top_features)}")
        
        # Query-specific insights
        query_lower = query.lower()
        if 'predict' in query_lower or 'forecast' in query_lower:
            insights.append("Model is ready for making predictions on new data")
        elif 'important' in query_lower or 'factor' in query_lower:
            insights.append("Feature importance analysis reveals key business drivers")
        
        # Model reliability insight
        if len(model_results) > 1:
            # Compare top 2 models
            sorted_models = sorted(
                model_results.items(),
                key=lambda x: self._get_primary_metric(x[1]['performance'], is_classification),
                reverse=True
            )
            
            if len(sorted_models) >= 2:
                best_score = self._get_primary_metric(sorted_models[0][1]['performance'], is_classification)
                second_score = self._get_primary_metric(sorted_models[1][1]['performance'], is_classification)
                
                if abs(best_score - second_score) < 0.05:
                    insights.append("Multiple models show similar performance - results are robust")
                else:
                    insights.append(f"{best_model_name} significantly outperforms other models")
        
        return insights

    def _get_primary_metric(self, performance: Dict, is_classification: bool) -> float:
        """Get the primary metric value for model comparison"""
        if is_classification:
            return performance.get('accuracy', performance.get('accuracy_mean', 0))
        else:
            return performance.get('r2_score', performance.get('r2_score_mean', 0))

    def _create_training_summary(self, model_results: Dict[str, Dict]) -> Dict[str, Any]:
        """Create summary of the training process"""
        return {
            'total_models_trained': len(model_results),
            'successful_models': len([r for r in model_results.values() if 'error' not in r['performance']]),
            'model_types': list(model_results.keys()),
            'training_completed': True,
            'hyperparameter_tuning': 'grid_search_applied',
            'evaluation_method': 'test_set' if any('test_samples' in r['performance'] for r in model_results.values()) else 'cross_validation'
        }

    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            'name': self.name,
            'id': self.id,
            'capabilities': [
                'supervised_learning',
                'classification_models',
                'regression_models',
                'hyperparameter_tuning',
                'cross_validation',
                'feature_importance',
                'model_selection',
                'performance_evaluation',
                'model_interpretation'
            ],
            'algorithms': [
                'random_forest',
                'gradient_boosting',
                'xgboost',
                'logistic_regression',
                'linear_regression',
                'ridge_regression'
            ],
            'metrics': {
                'classification': ['accuracy', 'precision', 'recall', 'f1_score'],
                'regression': ['r2_score', 'rmse', 'mae', 'mse']
            },
            'input_requirements': ['target_variable', 'feature_matrix'],
            'output_format': 'trained_models_with_performance_metrics'
        }