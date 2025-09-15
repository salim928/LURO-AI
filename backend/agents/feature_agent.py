import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.preprocessing import PolynomialFeatures
from sklearn.decomposition import PCA
from .base_agent import BaseAgent, AgentInput, AgentResult
import warnings
warnings.filterwarnings('ignore')

class FeatureEngineeringAgent(BaseAgent):
    """Agent responsible for advanced feature engineering"""
    
    def __init__(self):
        super().__init__("FeatureEngineeringAgent")
        
    def validate_input(self, input_data: AgentInput) -> bool:
        """Validate input data for feature engineering"""
        if not isinstance(input_data.data, pd.DataFrame):
            return False
        
        if input_data.data.empty:
            return False
        
        # Need numeric columns for most feature engineering
        numeric_cols = input_data.data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) < 2:
            return False
            
        return True
    
    def process(self, input_data: AgentInput) -> AgentResult:
        """Engineer new features from existing data"""
        try:
            df = input_data.data.copy()
            query = input_data.context.get('query', '')
            
            self.log_processing_start(input_data)
            
            # Get validated hypotheses from previous agents
            validated_hypotheses = []
            if input_data.previous_results:
                for result in input_data.previous_results:
                    if result.metadata and 'validated_hypotheses' in result.metadata:
                        validated_hypotheses.extend(result.metadata['validated_hypotheses'])
            
            # Apply different feature engineering techniques
            engineered_df = df.copy()
            engineering_log = []
            
            # 1. Hypothesis-based features
            if validated_hypotheses:
                engineered_df, hyp_log = self._create_hypothesis_features(engineered_df, validated_hypotheses)
                engineering_log.extend(hyp_log)
            
            # 2. Mathematical transformations
            engineered_df, math_log = self._create_mathematical_features(engineered_df)
            engineering_log.extend(math_log)
            
            # 3. Interaction features
            engineered_df, interaction_log = self._create_interaction_features(engineered_df)
            engineering_log.extend(interaction_log)
            
            # 4. Time-based features (if date columns exist)
            engineered_df, time_log = self._create_time_features(engineered_df)
            engineering_log.extend(time_log)
            
            # 5. Aggregate features (if grouping variables exist)
            engineered_df, agg_log = self._create_aggregate_features(engineered_df)
            engineering_log.extend(agg_log)
            
            # 6. Dimensionality reduction features (if many features)
            if engineered_df.shape[1] > 20:
                engineered_df, pca_log = self._create_pca_features(engineered_df)
                engineering_log.extend(pca_log)
            
            # Feature importance scoring
            feature_scores = self._score_new_features(df, engineered_df)
            
            # Generate insights
            insights = self._generate_engineering_insights(df, engineered_df, engineering_log)
            
            result = AgentResult(
                agent_name=self.name,
                success=True,
                data=engineered_df,
                metadata={
                    'original_feature_count': df.shape[1],
                    'final_feature_count': engineered_df.shape[1],
                    'new_features_created': engineered_df.shape[1] - df.shape[1],
                    'engineering_log': engineering_log,
                    'feature_scores': feature_scores,
                    'insights': insights,
                    'feature_categories': self._categorize_features(engineered_df)
                }
            )
            
            self.log_processing_end(result)
            return result
            
        except Exception as e:
            return self.handle_error(e, input_data)
    
    def _create_hypothesis_features(self, df: pd.DataFrame, hypotheses: List[Dict]) -> Tuple[pd.DataFrame, List[str]]:
        """Create features based on validated statistical hypotheses"""
        log = []
        
        for hypothesis in hypotheses:
            if not hypothesis.get('significant', False):
                continue
                
            try:
                if hypothesis['type'] == 'correlation' and hypothesis.get('effect_size', 0) > 0.3:
                    # Create interaction and ratio features for strong correlations
                    var1, var2 = hypothesis['variables']
                    
                    if var1 in df.columns and var2 in df.columns:
                        # Interaction term
                        df[f'{var1}_{var2}_interaction'] = df[var1] * df[var2]
                        
                        # Ratio term (avoid division by zero)
                        df[f'{var1}_{var2}_ratio'] = df[var1] / (df[var2] + 1e-8)
                        
                        log.append(f"Created interaction and ratio features for {var1} and {var2}")
                
                elif hypothesis['type'] == 'categorical_numeric':
                    # Create group-based statistical features
                    cat_col, num_col = hypothesis['variables']
                    
                    if cat_col in df.columns and num_col in df.columns:
                        # Group statistics
                        group_stats = df.groupby(cat_col)[num_col].agg(['mean', 'std', 'median']).add_prefix(f'{cat_col}_{num_col}_')
                        
                        # Map back to original data
                        for stat in ['mean', 'std', 'median']:
                            feature_name = f'{cat_col}_{num_col}_{stat}'
                            df[feature_name] = df[cat_col].map(group_stats[feature_name])
                        
                        # Deviation from group mean
                        df[f'{num_col}_deviation_from_{cat_col}_mean'] = df[num_col] - df[f'{cat_col}_{num_col}_mean']
                        
                        log.append(f"Created group statistical features for {cat_col} and {num_col}")
                        
            except Exception as e:
                self.logger.warning(f"Failed to create hypothesis feature: {e}")
                continue
        
        return df, log
    
    def _create_mathematical_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Create mathematical transformation features"""
        log = []
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            try:
                # Skip if column has negative values for log transform
                if df[col].min() > 0:
                    df[f'{col}_log'] = np.log(df[col] + 1)
                    log.append(f"Created log transform for {col}")
                
                # Square root transform
                if df[col].min() >= 0:
                    df[f'{col}_sqrt'] = np.sqrt(df[col])
                    log.append(f"Created square root transform for {col}")
                
                # Square transform
                df[f'{col}_squared'] = df[col] ** 2
                
                # Binning for continuous variables with many unique values
                if df[col].nunique() > 10:
                    df[f'{col}_binned'] = pd.cut(df[col], bins=5, labels=False)
                    log.append(f"Created binned version of {col}")
                    
            except Exception as e:
                self.logger.warning(f"Failed to create mathematical features for {col}: {e}")
                continue
        
        log.append(f"Created mathematical transformations for {len(numeric_cols)} numeric columns")
        return df, log
    
    def _create_interaction_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Create interaction features between top variables"""
        log = []
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Limit to top correlated pairs to avoid feature explosion
        if len(numeric_cols) > 2:
            # Calculate correlations and select top pairs
            corr_matrix = df[numeric_cols].corr().abs()
            
            # Get top 5 correlated pairs (excluding self-correlations)
            top_pairs = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    corr_val = corr_matrix.iloc[i, j]
                    if not pd.isna(corr_val):
                        top_pairs.append((corr_matrix.columns[i], corr_matrix.columns[j], corr_val))
            
            # Sort by correlation and take top 5
            top_pairs.sort(key=lambda x: x[2], reverse=True)
            top_pairs = top_pairs[:5]
            
            # Create interaction features for top pairs
            for col1, col2, corr_val in top_pairs:
                try:
                    df[f'{col1}_{col2}_multiply'] = df[col1] * df[col2]
                    df[f'{col1}_{col2}_add'] = df[col1] + df[col2]
                    
                    if df[col2].min() > 0:
                        df[f'{col1}_{col2}_divide'] = df[col1] / df[col2]
                    
                    log.append(f"Created interaction features for {col1} and {col2} (corr: {corr_val:.3f})")
                    
                except Exception as e:
                    self.logger.warning(f"Failed to create interaction for {col1} and {col2}: {e}")
                    continue
        
        return df, log
    
    def _create_time_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Create time-based features"""
        log = []
        
        # Find date columns
        date_cols = []
        for col in df.columns:
            if 'date' in col.lower() or 'time' in col.lower():
                try:
                    df[col] = pd.to_datetime(df[col])
                    date_cols.append(col)
                except:
                    continue
        
        for date_col in date_cols:
            try:
                # Extract time components
                df[f'{date_col}_year'] = df[date_col].dt.year
                df[f'{date_col}_month'] = df[date_col].dt.month
                df[f'{date_col}_day'] = df[date_col].dt.day
                df[f'{date_col}_weekday'] = df[date_col].dt.dayofweek
                df[f'{date_col}_quarter'] = df[date_col].dt.quarter
                
                # Create cyclical features for seasonality
                df[f'{date_col}_month_sin'] = np.sin(2 * np.pi * df[date_col].dt.month / 12)
                df[f'{date_col}_month_cos'] = np.cos(2 * np.pi * df[date_col].dt.month / 12)
                
                # Days since minimum date (trend feature)
                min_date = df[date_col].min()
                df[f'{date_col}_days_since_start'] = (df[date_col] - min_date).dt.days
                
                log.append(f"Created time-based features for {date_col}")
                
                # Rolling window features if we have enough data and numeric columns
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(df) > 30:  # Need sufficient data for rolling windows
                    df_sorted = df.sort_values(date_col)
                    
                    for num_col in numeric_cols[:3]:  # Limit to prevent feature explosion
                        try:
                            # 7-day rolling average
                            df[f'{num_col}_7day_avg'] = df_sorted[num_col].rolling(window=7, min_periods=1).mean()
                            
                            # 7-day rolling std
                            df[f'{num_col}_7day_std'] = df_sorted[num_col].rolling(window=7, min_periods=1).std()
                            
                            log.append(f"Created rolling window features for {num_col}")
                            
                        except Exception as e:
                            self.logger.warning(f"Failed to create rolling features for {num_col}: {e}")
                            continue
                            
            except Exception as e:
                self.logger.warning(f"Failed to create time features for {date_col}: {e}")
                continue
        
        return df, log
    
    def _create_aggregate_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Create aggregate features based on grouping variables"""
        log = []
        
        categorical_cols = df.select_dtypes(include=['object']).columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        # Create aggregate features for categorical variables with reasonable cardinality
        for cat_col in categorical_cols:
            if df[cat_col].nunique() <= 20 and df[cat_col].nunique() >= 2:
                
                for num_col in numeric_cols[:3]:  # Limit to prevent explosion
                    try:
                        # Group statistics
                        group_stats = df.groupby(cat_col)[num_col].agg([
                            'count', 'mean', 'std', 'min', 'max'
                        ]).add_prefix(f'{cat_col}_{num_col}_group_')
                        
                        # Map back to original data
                        for stat in ['count', 'mean', 'std', 'min', 'max']:
                            feature_name = f'{cat_col}_{num_col}_group_{stat}'
                            df[feature_name] = df[cat_col].map(group_stats[feature_name])
                        
                        log.append(f"Created aggregate features for {cat_col} and {num_col}")
                        
                    except Exception as e:
                        self.logger.warning(f"Failed to create aggregate features: {e}")
                        continue
        
        return df, log
    
    def _create_pca_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Create PCA features for dimensionality reduction"""
        log = []
        
        try:
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) > 10:  # Only if we have many numeric features
                # Apply PCA to reduce dimensionality
                pca = PCA(n_components=min(10, len(numeric_cols) // 2))
                
                # Fit PCA on numeric data (handle NaN)
                numeric_data = df[numeric_cols].fillna(0)
                pca_features = pca.fit_transform(numeric_data)
                
                # Add PCA features to dataframe
                for i in range(pca_features.shape[1]):
                    df[f'pca_component_{i}'] = pca_features[:, i]
                
                # Store explained variance ratio
                explained_var = pca.explained_variance_ratio_.sum()
                
                log.append(f"Created {pca_features.shape[1]} PCA components explaining {explained_var:.1%} of variance")
        
        except Exception as e:
            self.logger.warning(f"Failed to create PCA features: {e}")
        
        return df, log
    
    def _score_new_features(self, original_df: pd.DataFrame, engineered_df: pd.DataFrame) -> Dict[str, float]:
        """Score new features based on various criteria"""
        scores = {}
        
        # Get new feature names
        new_features = set(engineered_df.columns) - set(original_df.columns)
        
        for feature in new_features:
            try:
                # Basic quality scores
                non_null_ratio = engineered_df[feature].count() / len(engineered_df)
                unique_ratio = engineered_df[feature].nunique() / len(engineered_df)
                
                # Variance score (normalized)
                if engineered_df[feature].dtype in [np.number]:
                    variance_score = min(1.0, engineered_df[feature].var() / (engineered_df[feature].var() + 1))
                else:
                    variance_score = unique_ratio
                
                # Combined score
                combined_score = (non_null_ratio * 0.4 + unique_ratio * 0.3 + variance_score * 0.3)
                scores[feature] = round(combined_score, 3)
                
            except Exception:
                scores[feature] = 0.0
        
        return scores
    
    def _categorize_features(self, df: pd.DataFrame) -> Dict[str, List[str]]:
        """Categorize features by their type and origin"""
        categories = {
            'original': [],
            'mathematical': [],
            'interaction': [],
            'time_based': [],
            'aggregate': [],
            'pca': [],
            'hypothesis': []
        }
        
        for col in df.columns:
            col_lower = col.lower()
            
            if '_log' in col_lower or '_sqrt' in col_lower or '_squared' in col_lower or '_binned' in col_lower:
                categories['mathematical'].append(col)
            elif '_interaction' in col_lower or '_multiply' in col_lower or '_add' in col_lower or '_divide' in col_lower:
                categories['interaction'].append(col)
            elif any(time_word in col_lower for time_word in ['year', 'month', 'day', 'weekday', 'quarter', 'sin', 'cos', 'rolling', 'days_since']):
                categories['time_based'].append(col)
            elif '_group_' in col_lower or '_avg' in col_lower or '_std' in col_lower:
                categories['aggregate'].append(col)
            elif 'pca_component' in col_lower:
                categories['pca'].append(col)
            elif '_ratio' in col_lower and '_interaction' in col_lower:
                categories['hypothesis'].append(col)
            else:
                categories['original'].append(col)
        
        return categories
    
    def _generate_engineering_insights(self, original_df: pd.DataFrame, engineered_df: pd.DataFrame, engineering_log: List[str]) -> List[str]:
        """Generate insights about feature engineering process"""
        insights = []
        
        # Feature count insight
        original_count = original_df.shape[1]
        final_count = engineered_df.shape[1]
        new_count = final_count - original_count
        
        insights.append(f"Created {new_count} new features, expanding from {original_count} to {final_count} total features")
        
        # Engineering techniques used
        techniques_used = set()
        for log_entry in engineering_log:
            if 'mathematical' in log_entry.lower() or 'transform' in log_entry.lower():
                techniques_used.add('mathematical transformations')
            elif 'interaction' in log_entry.lower():
                techniques_used.add('interaction features')
            elif 'time' in log_entry.lower():
                techniques_used.add('time-based features')
            elif 'aggregate' in log_entry.lower() or 'group' in log_entry.lower():
                techniques_used.add('aggregate features')
            elif 'pca' in log_entry.lower():
                techniques_used.add('PCA dimensionality reduction')
            elif 'hypothesis' in log_entry.lower():
                techniques_used.add('hypothesis-driven features')
        
        if techniques_used:
            insights.append(f"Applied {len(techniques_used)} feature engineering techniques: {', '.join(techniques_used)}")
        
        # Data quality insight
        null_ratios = engineered_df.isnull().sum() / len(engineered_df)
        high_null_features = (null_ratios > 0.1).sum()
        
        if high_null_features > 0:
            insights.append(f"Warning: {high_null_features} features have >10% missing values")
        else:
            insights.append("All engineered features have good data quality (<10% missing values)")
        
        return insights
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            'name': self.name,
            'id': self.id,
            'capabilities': [
                'hypothesis_based_features',
                'mathematical_transformations',
                'interaction_features',
                'time_series_features',
                'aggregate_features',
                'pca_features',
                'feature_scoring',
                'feature_categorization'
            ],
            'transformations': [
                'log_transform',
                'sqrt_transform',
                'polynomial_features',
                'interaction_terms',
                'rolling_windows',
                'cyclical_encoding'
            ],
            'input_requirements': ['pandas.DataFrame', 'minimum_2_numeric_columns'],
            'output_format': 'enhanced_feature_dataset'
        }