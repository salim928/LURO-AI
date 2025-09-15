### `backend/agents/hypothesis_agent.py`

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple
from scipy import stats
from sklearn.preprocessing import LabelEncoder
from .base_agent import BaseAgent, AgentInput, AgentResult
import warnings
warnings.filterwarnings('ignore')

class HypothesisAgent(BaseAgent):
    """Agent responsible for generating and testing statistical hypotheses"""
    
    def __init__(self):
        super().__init__("HypothesisAgent")
        self.label_encoders = {}
        
    def validate_input(self, input_data: AgentInput) -> bool:
        """Validate input data for hypothesis generation"""
        if not isinstance(input_data.data, pd.DataFrame):
            return False
        
        if input_data.data.empty:
            return False
        
        # Need at least 10 rows for meaningful statistical tests
        if len(input_data.data) < 10:
            return False
            
        return True
    
    def process(self, input_data: AgentInput) -> AgentResult:
        """Generate and test statistical hypotheses"""
        try:
            df = input_data.data
            query = input_data.context.get('query', '')
            
            self.log_processing_start(input_data)
            
            # Generate hypotheses based on data structure and query
            hypotheses = self._generate_hypotheses(df, query)
            
            # Test each hypothesis
            tested_hypotheses = []
            for hypothesis in hypotheses:
                test_result = self._test_hypothesis(df, hypothesis)
                if test_result:
                    tested_hypotheses.append(test_result)
            
            # Filter for significant results
            significant_hypotheses = [
                h for h in tested_hypotheses 
                if h.get('p_value', 1.0) < 0.05 and h.get('effect_size', 0) > 0.1
            ]
            
            # Create new features based on validated hypotheses
            enhanced_df = self._create_hypothesis_features(df, significant_hypotheses)
            
            # Generate insights
            insights = self._generate_insights(significant_hypotheses)
            
            result = AgentResult(
                agent_name=self.name,
                success=True,
                data=enhanced_df,
                metadata={
                    'total_hypotheses_tested': len(tested_hypotheses),
                    'significant_hypotheses': len(significant_hypotheses),
                    'validated_hypotheses': significant_hypotheses,
                    'insights': insights,
                    'statistical_summary': self._create_statistical_summary(tested_hypotheses)
                }
            )
            
            self.log_processing_end(result)
            return result
            
        except Exception as e:
            return self.handle_error(e, input_data)
    
    def _generate_hypotheses(self, df: pd.DataFrame, query: str) -> List[Dict[str, Any]]:
        """Generate testable hypotheses from data structure and query"""
        hypotheses = []
        
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        
        # Hypothesis 1: Relationships between categorical and numeric variables
        for cat_col in categorical_cols:
            for num_col in numeric_cols:
                if df[cat_col].nunique() <= 10:  # Reasonable number of categories
                    hypotheses.append({
                        'type': 'categorical_numeric',
                        'test': 'anova',
                        'variables': [cat_col, num_col],
                        'null_hypothesis': f"No difference in {num_col} across {cat_col} groups",
                        'alternative_hypothesis': f"Significant difference in {num_col} across {cat_col} groups"
                    })
        
        # Hypothesis 2: Correlations between numeric variables
        for i, col1 in enumerate(numeric_cols):
            for col2 in numeric_cols[i+1:]:
                hypotheses.append({
                    'type': 'correlation',
                    'test': 'pearson',
                    'variables': [col1, col2],
                    'null_hypothesis': f"No correlation between {col1} and {col2}",
                    'alternative_hypothesis': f"Significant correlation between {col1} and {col2}"
                })
        
        # Hypothesis 3: Independence between categorical variables
        for i, col1 in enumerate(categorical_cols):
            for col2 in categorical_cols[i+1:]:
                if df[col1].nunique() <= 10 and df[col2].nunique() <= 10:
                    hypotheses.append({
                        'type': 'categorical_independence',
                        'test': 'chi_square',
                        'variables': [col1, col2],
                        'null_hypothesis': f"{col1} and {col2} are independent",
                        'alternative_hypothesis': f"{col1} and {col2} are dependent"
                    })
        
        # Query-specific hypotheses
        query_hypotheses = self._generate_query_specific_hypotheses(df, query)
        hypotheses.extend(query_hypotheses)
        
        return hypotheses
    
    def _generate_query_specific_hypotheses(self, df: pd.DataFrame, query: str) -> List[Dict[str, Any]]:
        """Generate hypotheses based on user query"""
        query_lower = query.lower()
        hypotheses = []
        
        # Time-based hypotheses
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
        if date_cols and any(word in query_lower for word in ['trend', 'time', 'seasonal', 'month', 'year']):
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            for num_col in numeric_cols:
                hypotheses.append({
                    'type': 'time_trend',
                    'test': 'linear_regression',
                    'variables': [date_cols[0], num_col],
                    'null_hypothesis': f"No time trend in {num_col}",
                    'alternative_hypothesis': f"Significant time trend in {num_col}"
                })
        
        # Regional/geographic hypotheses
        if 'region' in df.columns and any(word in query_lower for word in ['region', 'location', 'geographic']):
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            for num_col in numeric_cols:
                hypotheses.append({
                    'type': 'regional_difference',
                    'test': 'anova',
                    'variables': ['region', num_col],
                    'null_hypothesis': f"No regional differences in {num_col}",
                    'alternative_hypothesis': f"Significant regional differences in {num_col}"
                })
        
        return hypotheses
    
    def _test_hypothesis(self, df: pd.DataFrame, hypothesis: Dict[str, Any]) -> Dict[str, Any]:
        """Test a specific hypothesis using appropriate statistical test"""
        try:
            test_type = hypothesis['test']
            variables = hypothesis['variables']
            
            if test_type == 'anova':
                return self._test_anova(df, variables[0], variables[1], hypothesis)
            elif test_type == 'pearson':
                return self._test_correlation(df, variables[0], variables[1], hypothesis)
            elif test_type == 'chi_square':
                return self._test_chi_square(df, variables[0], variables[1], hypothesis)
            elif test_type == 'linear_regression':
                return self._test_linear_trend(df, variables[0], variables[1], hypothesis)
            
        except Exception as e:
            self.logger.warning(f"Failed to test hypothesis: {e}")
            return None
    
    def _test_anova(self, df: pd.DataFrame, cat_col: str, num_col: str, hypothesis: Dict) -> Dict[str, Any]:
        """Test ANOVA hypothesis"""
        groups = [group[num_col].dropna() for name, group in df.groupby(cat_col)]
        groups = [g for g in groups if len(g) >= 3]  # Need at least 3 observations per group
        
        if len(groups) < 2:
            return None
        
        f_stat, p_value = stats.f_oneway(*groups)
        
        # Calculate effect size (eta squared)
        ss_between = sum(len(g) * (g.mean() - df[num_col].mean())**2 for g in groups)
        ss_total = ((df[num_col] - df[num_col].mean())**2).sum()
        eta_squared = ss_between / ss_total if ss_total > 0 else 0
        
        return {
            **hypothesis,
            'f_statistic': f_stat,
            'p_value': p_value,
            'effect_size': eta_squared,
            'effect_size_interpretation': self._interpret_effect_size(eta_squared, 'eta_squared'),
            'significant': p_value < 0.05,
            'groups_tested': len(groups),
            'test_result': 'Reject null hypothesis' if p_value < 0.05 else 'Fail to reject null hypothesis'
        }
    
    def _test_correlation(self, df: pd.DataFrame, col1: str, col2: str, hypothesis: Dict) -> Dict[str, Any]:
        """Test correlation hypothesis"""
        data1 = df[col1].dropna()
        data2 = df[col2].dropna()
        
        # Use only common indices
        common_idx = data1.index.intersection(data2.index)
        if len(common_idx) < 10:
            return None
        
        data1 = data1.loc[common_idx]
        data2 = data2.loc[common_idx]
        
        correlation, p_value = stats.pearsonr(data1, data2)
        
        return {
            **hypothesis,
            'correlation': correlation,
            'p_value': p_value,
            'effect_size': abs(correlation),
            'effect_size_interpretation': self._interpret_effect_size(abs(correlation), 'correlation'),
            'significant': p_value < 0.05,
            'sample_size': len(data1),
            'test_result': 'Significant correlation' if p_value < 0.05 else 'No significant correlation'
        }
    
    def _test_chi_square(self, df: pd.DataFrame, col1: str, col2: str, hypothesis: Dict) -> Dict[str, Any]:
        """Test chi-square independence hypothesis"""
        contingency_table = pd.crosstab(df[col1], df[col2])
        
        # Need at least 5 expected frequency in 80% of cells
        chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)
        
        # Calculate Cramer's V as effect size
        n = contingency_table.sum().sum()
        cramers_v = np.sqrt(chi2 / (n * (min(contingency_table.shape) - 1)))
        
        return {
            **hypothesis,
            'chi2_statistic': chi2,
            'p_value': p_value,
            'degrees_of_freedom': dof,
            'effect_size': cramers_v,
            'effect_size_interpretation': self._interpret_effect_size(cramers_v, 'cramers_v'),
            'significant': p_value < 0.05,
            'contingency_table': contingency_table.to_dict(),
            'test_result': 'Variables are dependent' if p_value < 0.05 else 'Variables are independent'
        }
    
    def _test_linear_trend(self, df: pd.DataFrame, time_col: str, value_col: str, hypothesis: Dict) -> Dict[str, Any]:
        """Test linear trend hypothesis"""
        # Convert time column to numeric if needed
        if pd.api.types.is_datetime64_any_dtype(df[time_col]):
            time_numeric = (df[time_col] - df[time_col].min()).dt.days
        else:
            time_numeric = df[time_col]
        
        # Remove NaN values
        mask = ~(time_numeric.isna() | df[value_col].isna())
        time_clean = time_numeric[mask]
        value_clean = df[value_col][mask]
        
        if len(time_clean) < 10:
            return None
        
        slope, intercept, r_value, p_value, std_err = stats.linregress(time_clean, value_clean)
        
        return {
            **hypothesis,
            'slope': slope,
            'r_squared': r_value**2,
            'p_value': p_value,
            'effect_size': abs(r_value),
            'effect_size_interpretation': self._interpret_effect_size(abs(r_value), 'correlation'),
            'significant': p_value < 0.05,
            'trend_direction': 'increasing' if slope > 0 else 'decreasing',
            'test_result': 'Significant trend' if p_value < 0.05 else 'No significant trend'
        }
    
    def _interpret_effect_size(self, effect_size: float, test_type: str) -> str:
        """Interpret effect size magnitude"""
        if test_type == 'correlation':
            if effect_size < 0.1:
                return 'negligible'
            elif effect_size < 0.3:
                return 'small'
            elif effect_size < 0.5:
                return 'medium'
            else:
                return 'large'
        elif test_type == 'eta_squared':
            if effect_size < 0.01:
                return 'negligible'
            elif effect_size < 0.06:
                return 'small'
            elif effect_size < 0.14:
                return 'medium'
            else:
                return 'large'
        elif test_type == 'cramers_v':
            if effect_size < 0.1:
                return 'negligible'
            elif effect_size < 0.3:
                return 'small'
            elif effect_size < 0.5:
                return 'medium'
            else:
                return 'large'
        else:
            return 'unknown'
    
    def _create_hypothesis_features(self, df: pd.DataFrame, hypotheses: List[Dict]) -> pd.DataFrame:
        """Create new features based on validated hypotheses"""
        enhanced_df = df.copy()
        
        for hypothesis in hypotheses:
            if hypothesis['significant'] and hypothesis['effect_size'] > 0.1:
                feature_name = f"hypothesis_{hypothesis['type']}_{len(enhanced_df.columns)}"
                
                if hypothesis['type'] == 'correlation':
                    # Create interaction term
                    var1, var2 = hypothesis['variables']
                    enhanced_df[f'{var1}_{var2}_interaction'] = df[var1] * df[var2]
                
                elif hypothesis['type'] == 'categorical_numeric':
                    # Create group-based features
                    cat_col, num_col = hypothesis['variables']
                    group_means = df.groupby(cat_col)[num_col].mean()
                    enhanced_df[f'{cat_col}_{num_col}_group_mean'] = df[cat_col].map(group_means)
        
        return enhanced_df
    
    def _generate_insights(self, hypotheses: List[Dict]) -> List[str]:
        """Generate business insights from hypothesis test results"""
        insights = []
        
        for h in hypotheses:
            if h['significant']:
                if h['type'] == 'correlation':
                    var1, var2 = h['variables']
                    direction = "positively" if h['correlation'] > 0 else "negatively"
                    strength = h['effect_size_interpretation']
                    insights.append(f"{var1} and {var2} are {strength}ly {direction} correlated (r={h['correlation']:.3f})")
                
                elif h['type'] == 'categorical_numeric':
                    cat_col, num_col = h['variables']
                    insights.append(f"Significant differences in {num_col} across {cat_col} groups (effect size: {h['effect_size_interpretation']})")
                
                elif h['type'] == 'time_trend':
                    _, value_col = h['variables']
                    direction = h['trend_direction']
                    insights.append(f"{value_col} shows a significant {direction} trend over time (R²={h['r_squared']:.3f})")
        
        return insights
    
    def _create_statistical_summary(self, hypotheses: List[Dict]) -> Dict[str, Any]:
        """Create summary of all statistical tests performed"""
        if not hypotheses:
            return {}
        
        significant_count = sum(1 for h in hypotheses if h.get('significant', False))
        
        return {
            'total_tests': len(hypotheses),
            'significant_results': significant_count,
            'significance_rate': significant_count / len(hypotheses),
            'test_types': list(set(h.get('test', 'unknown') for h in hypotheses)),
            'bonferroni_adjusted_alpha': 0.05 / len(hypotheses),
            'multiple_testing_note': f"With {len(hypotheses)} tests, consider Bonferroni correction (α = {0.05/len(hypotheses):.4f})"
        }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            'name': self.name,
            'id': self.id,
            'capabilities': [
                'hypothesis_generation',
                'statistical_testing',
                'anova_analysis',
                'correlation_analysis',
                'chi_square_testing',
                'trend_analysis',
                'effect_size_calculation',
                'feature_creation'
            ],
            'statistical_tests': [
                'one_way_anova',
                'pearson_correlation',
                'chi_square_independence',
                'linear_regression'
            ],
            'input_requirements': ['pandas.DataFrame', 'minimum_10_rows'],
            'output_format': 'enhanced_dataframe_with_statistical_results'
        }
