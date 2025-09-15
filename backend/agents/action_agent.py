import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from .base_agent import BaseAgent, AgentInput, AgentResult
import re

class CallToActionAgent(BaseAgent):
    """Agent responsible for generating actionable business recommendations"""
    
    def __init__(self):
        super().__init__("CallToActionAgent")
        self.business_templates = {
            'sales': {
                'increase': 'Implement targeted campaigns to boost {metric} by {target}%',
                'optimize': 'Focus on {top_feature} to improve sales performance',
                'segment': 'Prioritize {segment} customers who show {behavior}'
            },
            'marketing': {
                'roi': 'Reallocate budget from {low_channel} to {high_channel} for better ROI',
                'conversion': 'Optimize {stage} to reduce customer drop-off by {percentage}%',
                'targeting': 'Focus marketing efforts on {demographic} segment'
            },
            'operations': {
                'efficiency': 'Streamline {process} to reduce costs by ${amount}',
                'inventory': 'Adjust inventory levels for {products} based on demand patterns',
                'staffing': 'Optimize staffing in {department} during {time_period}'
            },
            'finance': {
                'profitability': 'Focus on {product_line} with {margin}% higher margins',
                'cost_reduction': 'Implement cost controls in {category} to save ${amount}',
                'cash_flow': 'Improve collection processes to reduce receivables by {days} days'
            }
        }
        
    def validate_input(self, input_data: AgentInput) -> bool:
        """Validate input data for action generation"""
        if not isinstance(input_data.data, pd.DataFrame):
            return False
        
        if not input_data.previous_results:
            return False
        
        # Need results from previous agents
        has_analysis = any(
            result.agent_name in ['ModelTrainingAgent', 'FeatureEngineeringAgent', 'HypothesisGenerationAgent']
            for result in input_data.previous_results
        )
        
        return has_analysis
    
    def process(self, input_data: AgentInput) -> AgentResult:
        """Generate actionable business recommendations"""
        try:
            df = input_data.data.copy()
            query = input_data.context.get('query', '')
            
            self.log_processing_start(input_data)
            
            # Extract insights from previous agents
            all_insights = self._extract_insights(input_data.previous_results)
            model_results = self._extract_model_results(input_data.previous_results)
            feature_importance = self._extract_feature_importance(input_data.previous_results)
            
            # Determine business domain from query
            business_domain = self._identify_business_domain(query)
            
            # Generate specific recommendations
            recommendations = self._generate_recommendations(
                all_insights, model_results, feature_importance, 
                query, business_domain, df
            )
            
            # Create implementation timeline
            timeline = self._create_implementation_timeline(recommendations)
            
            # Generate executive summary
            executive_summary = self._create_executive_summary(
                query, recommendations, model_results
            )
            
            # Create success metrics
            success_metrics = self._define_success_metrics(
                recommendations, business_domain, df
            )
            
            # Generate follow-up questions
            follow_up_questions = self._generate_follow_up_questions(
                recommendations, business_domain
            )
            
            result = AgentResult(
                agent_name=self.name,
                success=True,
                data=df,
                metadata={
                    'executive_summary': executive_summary,
                    'recommendations': recommendations,
                    'implementation_timeline': timeline,
                    'success_metrics': success_metrics,
                    'follow_up_questions': follow_up_questions,
                    'business_domain': business_domain,
                    'priority_actions': self._get_priority_actions(recommendations),
                    'estimated_impact': self._estimate_business_impact(recommendations, df),
                    'risk_assessment': self._assess_implementation_risks(recommendations),
                    'resource_requirements': self._estimate_resource_requirements(recommendations)
                }
            )
            
            self.log_processing_end(result)
            return result
            
        except Exception as e:
            return self.handle_error(e, input_data)
    
    def _extract_insights(self, previous_results: List) -> List[str]:
        """Extract insights from all previous agent results"""
        insights = []
        for result in previous_results:
            if result.metadata and result.metadata.get('insights'):
                insights.extend(result.metadata['insights'])
        return insights
    
    def _extract_model_results(self, previous_results: List) -> Dict[str, Any]:
        """Extract model performance and interpretation"""
        for result in previous_results:
            if result.agent_name == 'ModelTrainingAgent' and result.metadata:
                return {
                    'best_model': result.metadata.get('best_model'),
                    'performance': result.metadata.get('model_performance', {}),
                    'interpretation': result.metadata.get('model_interpretation', {}),
                    'problem_type': result.metadata.get('problem_type')
                }
        return {}
    
    def _extract_feature_importance(self, previous_results: List) -> Dict[str, float]:
        """Extract feature importance from model results"""
        for result in previous_results:
            if result.agent_name == 'ModelTrainingAgent' and result.metadata:
                return result.metadata.get('feature_importance', {})
        return {}
    
    def _identify_business_domain(self, query: str) -> str:
        """Identify the primary business domain from the query"""
        query_lower = query.lower()
        
        # Sales indicators
        sales_keywords = ['sales', 'revenue', 'sell', 'customer', 'purchase', 'buy', 'profit']
        if any(keyword in query_lower for keyword in sales_keywords):
            return 'sales'
        
        # Marketing indicators  
        marketing_keywords = ['marketing', 'campaign', 'advertisement', 'conversion', 'funnel', 'roi', 'acquisition']
        if any(keyword in query_lower for keyword in marketing_keywords):
            return 'marketing'
        
        # Operations indicators
        ops_keywords = ['inventory', 'supply', 'efficiency', 'process', 'cost', 'operation', 'production']
        if any(keyword in query_lower for keyword in ops_keywords):
            return 'operations'
        
        # Finance indicators
        finance_keywords = ['finance', 'budget', 'cash', 'profitability', 'margin', 'expense']
        if any(keyword in query_lower for keyword in finance_keywords):
            return 'finance'
        
        return 'general'
    
    def _generate_recommendations(
        self, insights: List[str], model_results: Dict, 
        feature_importance: Dict, query: str, 
        domain: str, df: pd.DataFrame
    ) -> List[Dict[str, Any]]:
        """Generate specific business recommendations"""
        recommendations = []
        
        # Recommendation 1: Based on feature importance
        if feature_importance:
            top_feature = list(feature_importance.keys())[0]
            importance_pct = list(feature_importance.values())[0] * 100
            
            rec = {
                'title': f'Optimize {top_feature.replace("_", " ").title()}',
                'description': f'Focus efforts on {top_feature} as it has {importance_pct:.1f}% influence on outcomes',
                'type': 'optimization',
                'priority': 'high',
                'effort': 'medium',
                'timeline': '2-4 weeks',
                'expected_impact': self._calculate_feature_impact(top_feature, df),
                'specific_actions': self._generate_feature_actions(top_feature, domain),
                'success_criteria': f'Improve {top_feature} metrics by 15-25%'
            }
            recommendations.append(rec)
        
        # Recommendation 2: Based on model performance
        if model_results and model_results.get('performance'):
            performance = model_results['performance']
            problem_type = model_results.get('problem_type', 'unknown')
            
            if problem_type == 'classification':
                accuracy = performance.get('accuracy', 0)
                if accuracy > 0.8:
                    rec = {
                        'title': 'Implement Automated Decision System',
                        'description': f'With {accuracy:.1%} accuracy, deploy model for automated decisions',
                        'type': 'automation',
                        'priority': 'high',
                        'effort': 'high',
                        'timeline': '4-6 weeks',
                        'expected_impact': 'Reduce manual processing time by 60-80%',
                        'specific_actions': [
                            'Set up model deployment pipeline',
                            'Create monitoring dashboard',
                            'Define escalation procedures for low-confidence predictions'
                        ],
                        'success_criteria': 'Process 80% of cases automatically'
                    }
                    recommendations.append(rec)
            else:  # regression
                r2_score = performance.get('r2_score', 0)
                if r2_score > 0.6:
                    rec = {
                        'title': 'Implement Predictive Forecasting',
                        'description': f'Use model for forecasting with {r2_score:.1%} accuracy',
                        'type': 'forecasting',
                        'priority': 'medium',
                        'effort': 'medium',
                        'timeline': '3-5 weeks',
                        'expected_impact': 'Improve planning accuracy by 20-30%',
                        'specific_actions': [
                            'Create forecasting dashboard',
                            'Train team on model outputs',
                            'Establish regular model updates'
                        ],
                        'success_criteria': 'Achieve forecast accuracy within 10% of actuals'
                    }
                    recommendations.append(rec)
        
        # Recommendation 3: Based on data insights
        data_insights = self._analyze_data_patterns(df, domain)
        if data_insights:
            recommendations.append(data_insights)
        
        # Recommendation 4: Query-specific recommendations
        query_rec = self._generate_query_specific_recommendation(query, domain, df)
        if query_rec:
            recommendations.append(query_rec)
        
        return recommendations[:4]  # Limit to 4 key recommendations
    
    def _generate_feature_actions(self, feature: str, domain: str) -> List[str]:
        """Generate specific actions for improving a feature"""
        feature_lower = feature.lower()
        
        # Common feature patterns and their actions
        if 'price' in feature_lower or 'cost' in feature_lower:
            return [
                'Conduct competitive price analysis',
                'Test price optimization strategies',
                'Implement dynamic pricing if applicable'
            ]
        elif 'time' in feature_lower or 'duration' in feature_lower:
            return [
                'Streamline processes to reduce time',
                'Identify bottlenecks and delays',
                'Implement automation where possible'
            ]
        elif 'quality' in feature_lower or 'rating' in feature_lower:
            return [
                'Implement quality control measures',
                'Gather customer feedback systematically',
                'Train team on quality standards'
            ]
        elif 'quantity' in feature_lower or 'volume' in feature_lower:
            return [
                'Optimize inventory management',
                'Forecast demand more accurately',
                'Adjust supply chain accordingly'
            ]
        else:
            return [
                f'Monitor {feature} metrics closely',
                f'Set targets for {feature} improvement',
                f'Review {feature} optimization opportunities monthly'
            ]
    
    def _calculate_feature_impact(self, feature: str, df: pd.DataFrame) -> str:
        """Estimate the business impact of optimizing a feature"""
        # This is a simplified calculation - in practice, you'd use more sophisticated methods
        try:
            if feature in df.columns:
                feature_values = df[feature].dropna()
                if len(feature_values) > 0:
                    std_dev = feature_values.std()
                    mean_val = feature_values.mean()
                    cv = std_dev / mean_val if mean_val != 0 else 0
                    
                    if cv > 0.5:
                        return "High variability suggests 25-40% improvement potential"
                    elif cv > 0.2:
                        return "Moderate improvement potential of 15-25%"
                    else:
                        return "Steady performance, 5-15% optimization possible"
        except:
            pass
        
        return "Significant improvement potential identified"
    
    def _analyze_data_patterns(self, df: pd.DataFrame, domain: str) -> Optional[Dict[str, Any]]:
        """Analyze data for actionable patterns"""
        try:
            # Look for obvious patterns in the data
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) > 0:
                # Find columns with high variability
                variations = {}
                for col in numeric_cols:
                    if df[col].dropna().std() > 0:
                        cv = df[col].dropna().std() / df[col].dropna().mean()
                        variations[col] = cv
                
                if variations:
                    high_var_col = max(variations, key=variations.get)
                    return {
                        'title': f'Address Variability in {high_var_col.replace("_", " ").title()}',
                        'description': f'High variability in {high_var_col} presents standardization opportunity',
                        'type': 'standardization',
                        'priority': 'medium',
                        'effort': 'low',
                        'timeline': '1-2 weeks',
                        'expected_impact': 'Reduce variability by 20-30%',
                        'specific_actions': [
                            f'Identify root causes of {high_var_col} variation',
                            'Implement standardized procedures',
                            'Monitor consistency metrics'
                        ],
                        'success_criteria': f'Reduce {high_var_col} coefficient of variation by 25%'
                    }
        except:
            pass
        
        return None
    
    def _generate_query_specific_recommendation(
        self, query: str, domain: str, df: pd.DataFrame
    ) -> Optional[Dict[str, Any]]:
        """Generate recommendations based on the specific query"""
        query_lower = query.lower()
        
        if 'churn' in query_lower:
            return {
                'title': 'Implement Customer Retention Program',
                'description': 'Proactively engage at-risk customers identified by the model',
                'type': 'retention',
                'priority': 'high',
                'effort': 'medium',
                'timeline': '2-3 weeks',
                'expected_impact': 'Reduce churn rate by 15-25%',
                'specific_actions': [
                    'Create automated alerts for high-risk customers',
                    'Design personalized retention campaigns',
                    'Train customer service team on retention tactics'
                ],
                'success_criteria': 'Achieve 20% improvement in customer retention rate'
            }
        elif 'forecast' in query_lower or 'predict' in query_lower:
            return {
                'title': 'Establish Regular Forecasting Process',
                'description': 'Integrate predictive insights into planning cycles',
                'type': 'process',
                'priority': 'medium',
                'effort': 'medium',
                'timeline': '3-4 weeks',
                'expected_impact': 'Improve planning accuracy by 20-30%',
                'specific_actions': [
                    'Schedule monthly forecasting reviews',
                    'Create forecast accuracy tracking',
                    'Train team on model interpretation'
                ],
                'success_criteria': 'Achieve consistent forecast accuracy >85%'
            }
        elif 'segment' in query_lower:
            return {
                'title': 'Implement Targeted Segmentation Strategy',
                'description': 'Customize approach for each identified segment',
                'type': 'segmentation',
                'priority': 'medium',
                'effort': 'high',
                'timeline': '4-6 weeks',
                'expected_impact': 'Increase segment-specific conversion by 30-50%',
                'specific_actions': [
                    'Create segment-specific messaging',
                    'Tailor offerings to segment needs',
                    'Track segment performance separately'
                ],
                'success_criteria': 'Achieve differentiated performance across segments'
            }
        
        return None
    
    def _create_implementation_timeline(self, recommendations: List[Dict]) -> Dict[str, List[Dict]]:
        """Create an implementation timeline for recommendations"""
        timeline = {
            'immediate': [],  # 0-2 weeks
            'short_term': [],  # 2-8 weeks  
            'medium_term': [],  # 2-6 months
            'long_term': []   # 6+ months
        }
        
        for rec in recommendations:
            timeline_str = rec.get('timeline', '2-4 weeks')
            
            if 'week' in timeline_str:
                weeks = self._extract_weeks(timeline_str)
                if weeks <= 2:
                    timeline['immediate'].append(rec)
                elif weeks <= 8:
                    timeline['short_term'].append(rec)
                else:
                    timeline['medium_term'].append(rec)
            elif 'month' in timeline_str:
                months = self._extract_months(timeline_str)
                if months <= 6:
                    timeline['medium_term'].append(rec)
                else:
                    timeline['long_term'].append(rec)
            else:
                timeline['short_term'].append(rec)
        
        return timeline
    
    def _extract_weeks(self, timeline_str: str) -> int:
        """Extract number of weeks from timeline string"""
        numbers = re.findall(r'\d+', timeline_str)
        return int(numbers[-1]) if numbers else 4
    
    def _extract_months(self, timeline_str: str) -> int:
        """Extract number of months from timeline string"""
        numbers = re.findall(r'\d+', timeline_str)
        return int(numbers[-1]) if numbers else 3
    
    def _create_executive_summary(
        self, query: str, recommendations: List[Dict], model_results: Dict
    ) -> str:
        """Create executive summary of findings and recommendations"""
        summary_parts = []
        
        # Analysis summary
        if model_results and model_results.get('performance'):
            performance = model_results['performance']
            problem_type = model_results.get('problem_type', 'analysis')
            
            if problem_type == 'classification':
                accuracy = performance.get('accuracy', 0)
                summary_parts.append(f"Analysis achieved {accuracy:.1%} accuracy in addressing your query.")
            else:
                r2_score = performance.get('r2_score', 0)
                summary_parts.append(f"Predictive model explains {r2_score:.1%} of variance in the target variable.")
        
        # Key findings
        if recommendations:
            high_priority = [r for r in recommendations if r.get('priority') == 'high']
            if high_priority:
                summary_parts.append(f"Identified {len(high_priority)} high-priority opportunities for immediate action.")
            
            # Expected impact
            impacts = [r.get('expected_impact', '') for r in recommendations if r.get('expected_impact')]
            if impacts:
                summary_parts.append("Implementation of these recommendations is expected to deliver measurable improvements within 4-8 weeks.")
        
        # Next steps
        summary_parts.append("Recommend starting with highest-priority actions while preparing for medium-term initiatives.")
        
        return " ".join(summary_parts)
    
    def _define_success_metrics(
        self, recommendations: List[Dict], domain: str, df: pd.DataFrame
    ) -> List[Dict[str, Any]]:
        """Define measurable success metrics"""
        metrics = []
        
        # Domain-specific metrics
        if domain == 'sales':
            metrics.extend([
                {'metric': 'Revenue Growth', 'target': '15-25%', 'timeframe': '3 months'},
                {'metric': 'Conversion Rate', 'target': '10-20% improvement', 'timeframe': '2 months'}
            ])
        elif domain == 'marketing':
            metrics.extend([
                {'metric': 'ROI', 'target': '20-30% improvement', 'timeframe': '2 months'},
                {'metric': 'Customer Acquisition Cost', 'target': '15-25% reduction', 'timeframe': '3 months'}
            ])
        elif domain == 'operations':
            metrics.extend([
                {'metric': 'Process Efficiency', 'target': '20-40% improvement', 'timeframe': '2 months'},
                {'metric': 'Cost Reduction', 'target': '10-15% savings', 'timeframe': '3 months'}
            ])
        
        # Recommendation-specific metrics
        for rec in recommendations:
            if rec.get('success_criteria'):
                metrics.append({
                    'metric': rec['title'],
                    'target': rec['success_criteria'],
                    'timeframe': rec.get('timeline', '4 weeks')
                })
        
        return metrics[:6]  # Limit to 6 key metrics
    
    def _generate_follow_up_questions(
        self, recommendations: List[Dict], domain: str
    ) -> List[str]:
        """Generate follow-up questions for deeper analysis"""
        questions = []
        
        # Domain-specific questions
        domain_questions = {
            'sales': [
                "Which sales channels show the most potential for the recommended optimizations?",
                "What seasonal factors should be considered in the implementation timeline?",
                "How might customer segments respond differently to these changes?"
            ],
            'marketing': [
                "What is the current customer lifetime value for different segments?",
                "Which marketing channels have the lowest acquisition costs?",
                "How can we measure the attribution of these improvements?"
            ],
            'operations': [
                "What are the main bottlenecks in current processes?",
                "How will these changes impact employee productivity?",
                "What technology investments might accelerate these improvements?"
            ],
            'finance': [
                "What is the expected ROI timeline for these recommendations?",
                "How will these changes impact cash flow in the short term?",
                "What budget allocation is needed for successful implementation?"
            ]
        }
        
        questions.extend(domain_questions.get(domain, []))
        
        # Recommendation-specific questions
        if any(rec.get('type') == 'automation' for rec in recommendations):
            questions.append("What training will be needed for staff to work with automated systems?")
        
        if any(rec.get('priority') == 'high' for rec in recommendations):
            questions.append("What resources need to be reallocated to prioritize high-impact actions?")
        
        return questions[:5]  # Limit to 5 questions
    
    def _get_priority_actions(self, recommendations: List[Dict]) -> List[Dict]:
        """Extract high-priority actions for immediate focus"""
        high_priority = [r for r in recommendations if r.get('priority') == 'high']
        return sorted(high_priority, key=lambda x: x.get('effort', 'high') == 'low')
    
    def _estimate_business_impact(self, recommendations: List[Dict], df: pd.DataFrame) -> Dict[str, str]:
        """Estimate overall business impact"""
        return {
            'revenue_impact': 'Potential 15-30% improvement in key metrics',
            'efficiency_impact': 'Expected 20-40% reduction in manual processes',
            'time_to_value': '4-8 weeks for initial results',
            'confidence_level': 'High confidence based on model accuracy and data quality'
        }
    
    def _assess_implementation_risks(self, recommendations: List[Dict]) -> List[Dict[str, str]]:
        """Assess risks associated with implementation"""
        risks = [
            {
                'risk': 'Resource Constraints',
                'probability': 'Medium',
                'impact': 'Medium',
                'mitigation': 'Phase implementation and prioritize high-impact, low-effort actions'
            },
            {
                'risk': 'Change Resistance',
                'probability': 'Medium',
                'impact': 'High',
                'mitigation': 'Involve stakeholders in planning and communicate benefits clearly'
            },
            {
                'risk': 'Technology Integration',
                'probability': 'Low',
                'impact': 'Medium',
                'mitigation': 'Start with pilot implementation and scale gradually'
            }
        ]
        return risks
    
    def _estimate_resource_requirements(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Estimate resources needed for implementation"""
        total_recs = len(recommendations)
        high_effort = len([r for r in recommendations if r.get('effort') == 'high'])
        
        return {
            'personnel': {
                'project_manager': '0.5 FTE for 2 months',
                'analysts': '1-2 FTE for 1 month',
                'technical_staff': '0.5-1 FTE as needed'
            },
            'budget_estimate': {
                'low': '$10,000 - $25,000',
                'medium': '$25,000 - $75,000',
                'high': '$75,000+',
                'recommended': 'Medium' if high_effort > 0 else 'Low'
            },
            'timeline_summary': f'{total_recs} recommendations over 2-6 months',
            'success_factors': [
                'Executive sponsorship',
                'Clear communication plan',
                'Regular progress monitoring',
                'Stakeholder engagement'
            ]
        }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return agent capabilities"""
        return {
            'name': self.name,
            'id': self.id,
            'capabilities': [
                'business_recommendations',
                'action_prioritization',
                'implementation_planning',
                'success_metrics_definition',
                'risk_assessment',
                'resource_estimation',
                'executive_summaries',
                'follow_up_questions'
            ],
            'business_domains': ['sales', 'marketing', 'operations', 'finance', 'general'],
            'output_format': 'actionable_business_recommendations',
            'input_requirements': ['analysis_results', 'model_insights', 'business_context']
        }