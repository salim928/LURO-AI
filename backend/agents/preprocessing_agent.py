import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import SelectKBest, f_classif, f_regression, mutual_info_classif
from .base_agent import BaseAgent, AgentInput, AgentResult
import warnings
warnings.filterwarnings('ignore')

class PreprocessingAgent(BaseAgent):
    """Agent responsible for data preprocessing and preparation"""
    
    def __init__(self):
        super().__init__("PreprocessingAgent")
        self.scalers = {}
        self.encoders = {}
        
    def validate_input(self, input_data: AgentInput) -> bool:
        """Validate input data for preprocessing"""
        if not isinstance(input_data.data, pd.DataFrame):
            return False
        
        if input_data.data.empty:
            return False
            
        return True
    
    def process(self, input_data: AgentInput) -> AgentResult:
        """Preprocess data for machine learning"""
        try:
            df = input_data.data.copy()
            query = input_data.context.get('query', '')
            
            self.log_processing_start(input_data)
            
            # Detect target variable
            target_column = self._detect_target_variable(df, query)
            
            # Separate features and target
            if target_column:
                X = df.drop(columns=[target_column])
                y = df[target_column]
            else:
                X = df
                y = None
            
            # Apply preprocessing steps
            X_processed = self._apply_preprocessing_pipeline(X)
            
            # Feature selection if target is available
            if y is not None:
                X_selected = self._apply_feature_selection(X_processed, y)
                
                # Create train/test split
                X_train, X_test, y_train, y_test = train_test_split(
                    X_selected, y, test_size=0.2, random_state=42, stratify=y if self._is_classification(y) else None
                )
                
                # Combine back into DataFrames
                processed_df = pd.concat([
                    pd.DataFrame(X_train, columns=X_selected.columns),
                    pd.DataFrame({target_column: y_train})
                ], axis=1)
                
                test_df = pd.concat([
                    pd.DataFrame(X_test, columns=X_selected.columns),
                    pd.DataFrame({target_column: y_test})
                ], axis=1)
                
                metadata = {
                    'target_column': target_column,
                    'feature_columns': X_selected.columns.tolist(),
                    'train_size': len(processed_df),
                    'test_size': len(test_df),
                    'preprocessing_steps': self._get_preprocessing_summary(),
                    'feature_selection_applied': True,
                    'selected_features_count': X_selected.shape[1],
                    'test_data': test_df
                }
            else:
                # No target variable - return processed features only
                processed_df = pd.DataFrame(X_processed, columns=X.columns, index=X.index)
                
                metadata = {
                    'feature_columns': processed_df.columns.tolist(),
                    'preprocessing_steps': self._get_preprocessing_summary(),
                    'feature_selection_applied': False
                }
            
            # Generate insights about preprocessing
            insights = self._generate_preprocessing_insights(X, X_processed if y is None else X_selected, metadata)
            metadata['insights'] = insights
            
            result = AgentResult(
                agent_name=self.name,
                success=True,
                data=processed_df,
                metadata=metadata
            )
            
            self.log_processing_end(result)
            return result
            
        except Exception as e:
            return self.handle_error(e, input_data)
    
    def _detect_target_variable(self, df: pd.DataFrame, query: str) -> str:
        """Detect the target variable from query and data structure"""
        query_lower = query.lower()
        
        # Look for common target variable names in query
        target_keywords = {
            'sales': ['sales', 'revenue', 'income'],
            'price': ['price', 'cost', 'value'],
            'churn': ['churn', 'retention', 'left'],
            'conversion': ['conversion', 'convert', 'success'],
            'rating': ['rating', 'score', 'satisfaction'],
            'profit': ['profit', 'margin', 'profitability']
        }
        
        for category, keywords in target_keywords.items():
            if any(keyword in query_lower for keyword in keywords):
                # Look for matching column
                for col in df.columns:
                    if any(keyword in col.lower() for keyword in keywords):
                        return col
        
        # Default heuristics - look for columns that might be targets
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        # Check for binary columns (potential classification targets)
        for col in numeric_cols:
            unique_vals = df[col].nunique()
            if unique_vals == 2:
                return col
        
        # Check for columns with 'target', 'label', 'y' in name
        target_names = ['target', 'label', 'y', 'outcome', 'result']
        for col in df.columns:
            if any(name in col.lower() for name in target_names):
                return col
        
        return None
    
    def _apply_preprocessing_pipeline(self, X: pd.DataFrame) -> np.ndarray:
        """Apply comprehensive preprocessing pipeline"""
        X_processed = X.copy()
        
        # Handle categorical variables
        categorical_cols = X_processed.select_dtypes(include=['object']).columns
        
        for col in categorical_cols:
            unique_count = X_processed[col].nunique()
            
            if unique_count <= 10:  # One-hot encode low cardinality
                encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
                encoded = encoder.fit_transform(X_processed[[col]])
                
                # Create column names
                feature_names = [f"{col}_{cat}" for cat in encoder.categories_[0]]
                encoded_df = pd.DataFrame(encoded, columns=feature_names, index=X_processed.index)
                
                # Replace original column
                X_processed = pd.concat([X_processed.drop(columns=[col]), encoded_df], axis=1)
                self.encoders[col] = encoder
                
            else:  # Label encode high cardinality
                encoder = LabelEncoder()
                X_processed[col] = encoder.fit_transform(X_processed[col].astype(str))
                self.encoders[col] = encoder
        
        # Scale numeric features
        numeric_cols = X_processed.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) > 0:
            # Choose scaler based on data distribution
            scaler = self._choose_scaler(X_processed[numeric_cols])
            X_processed[numeric_cols] = scaler.fit_transform(X_processed[numeric_cols])
            self.scalers['numeric'] = scaler
        
        return X_processed.values
    
    def _choose_scaler(self, data: pd.DataFrame) -> object:
        """Choose appropriate scaler based on data distribution"""
        # Calculate skewness for each column
        skewness = data.skew().abs().mean()
        
        # Check for outliers
        outlier_ratio = self._calculate_outlier_ratio(data)
        
        if outlier_ratio > 0.1:  # Many outliers
            return RobustScaler()
        elif skewness > 2:  # Highly skewed data
            return RobustScaler()
        else:  # Normal-ish distribution
            return StandardScaler()
    
    def _calculate_outlier_ratio(self, data: pd.DataFrame) -> float:
        """Calculate the ratio of outliers in the data"""
        total_outliers = 0
        total_values = 0
        
        for col in data.columns:
            Q1 = data[col].quantile(0.25)
            Q3 = data[col].quantile(0.75)
            IQR = Q3 - Q1
            
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = ((data[col] < lower_bound) | (data[col] > upper_bound)).sum()
            total_outliers += outliers
            total_values += len(data[col])
        
        return total_outliers / total_values if total_values > 0 else 0
    
    def _is_classification(self, y: pd.Series) -> bool:
        """Determine if target variable is for classification"""
        if y.dtype == 'object':
            return True
        
        unique_count = y.nunique()
        total_count = len(y)
        
        # If unique values are less than 10% of total, likely classification
        return unique_count / total_count < 0.1 and unique_count <= 20
    
    def _apply_feature_selection(self, X: np.ndarray, y: pd.Series) -> pd.DataFrame:
        """Apply feature selection based on target variable type"""
        # Convert back to DataFrame for easier handling
        feature_names = [f"feature_{i}" for i in range(X.shape[1])]
        X_df = pd.DataFrame(X, columns=feature_names)
        
        # Determine number of features to select
        n_features = min(20, max(5, X.shape[1] // 2))  # Select reasonable number
        
        if self._is_classification(y):
            # Classification feature selection
            selector = SelectKBest(score_func=mutual_info_classif, k=n_features)
        else:
            # Regression feature selection
            selector = SelectKBest(score_func=f_regression, k=n_features)
        
        X_selected = selector.fit_transform(X_df, y)
        
        # Get selected feature names
        selected_features = X_df.columns[selector.get_support()].tolist()
        
        return pd.DataFrame(X_selected, columns=selected_features)
    
    def _get_preprocessing_summary(self) -> Dict[str, Any]:
        """Get summary of preprocessing steps applied"""
        return {
            'categorical_encoding': {
                'one_hot_encoded': [col for col, enc in self.encoders.items() 
                                   if isinstance(enc, OneHotEncoder)],
                'label_encoded': [col for col, enc in self.encoders.items() 
                                 if isinstance(enc, LabelEncoder)]
            },
            'scaling': {
                'scaler_type': type(self.scalers.get('numeric', None)).__name__ if 'numeric' in self.scalers else None,
                'scaled_features': 'numeric_features'
            },
            'data_split': {
                'test_size': 0.2,
                'random_state': 42,
                'stratified': True
            }
        }
    
    def _generate_preprocessing_insights(self, X_original: pd.DataFrame, X_processed: pd.DataFrame, metadata: Dict) -> List[str]:
        """Generate insights about the preprocessing steps"""
        insights = []
        
        # Data shape insights
        original_shape = X_original.shape
        processed_shape = X_processed.shape
        
        insights.append(f"Data preprocessed from {original_shape[1]} to {processed_shape[1]} features")
        
        # Encoding insights
        categorical_cols = X_original.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            insights.append(f"Encoded {len(categorical_cols)} categorical variables using appropriate methods")
        
        # Scaling insights
        if 'numeric' in self.scalers:
            scaler_name = type(self.scalers['numeric']).__name__
            insights.append(f"Applied {scaler_name} to normalize numeric features")
        
        # Feature selection insights
        if metadata.get('feature_selection_applied'):
            original_features = original_shape[1]
            selected_features = metadata['selected_features_count']
            reduction_ratio = (original_features - selected_features) / original_features * 100
            insights.append(f"Reduced features by {reduction_ratio:.1f}% through statistical selection")
        
        # Data split insights
        if 'train_size' in metadata:
            train_size = metadata['train_size']
            test_size = metadata['test_size']
            total_size = train_size + test_size
            insights.append(f"Created train ({train_size}/{total_size}) and test ({test_size}/{total_size}) splits")
        
        return insights
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            'name': self.name,
            'id': self.id,
            'capabilities': [
                'categorical_encoding',
                'feature_scaling', 
                'feature_selection',
                'train_test_split',
                'target_detection',
                'scaler_selection',
                'data_validation'
            ],
            'encoding_methods': ['one_hot_encoding', 'label_encoding'],
            'scaling_methods': ['standard_scaler', 'minmax_scaler', 'robust_scaler'],
            'selection_methods': ['mutual_info', 'f_regression', 'f_classif'],
            'input_requirements': ['pandas.DataFrame'],
            'output_format': 'ml_ready_dataset'
        }