import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
import warnings
warnings.filterwarnings('ignore')

class AutomatedInsightsAgent:
    """Generates automated insights and forecasts"""
    
    def __init__(self):
        self.insights = []
        self.forecasts = {}
    
    def generate_automated_insights(self, df: pd.DataFrame, query: str = "") -> Dict[str, Any]:
        """Generate comprehensive automated insights"""
        insights = {
            'key_findings': self._extract_key_findings(df),
            'anomalies': self._detect_anomalies(df),
            'trends': self._analyze_trends(df),
            'correlations': self._find_significant_correlations(df),
            'forecasts': self._generate_forecasts(df),
            'recommendations': self._generate_recommendations(df, query),
            'ghana_context': self._add_ghana_context(df)
        }
        
        return insights
    
    def _extract_key_findings(self, df: pd.DataFrame) -> List[str]:
        """Extract key business findings"""
        findings = []
        
        # Revenue/Sales analysis
        if 'sales' in df.columns:
            total_sales = df['sales'].sum()
            avg_sales = df['sales'].mean()
            sales_growth = self._calculate_period_over_period_growth(df, 'sales')
            
            findings.append(f"Total sales: GH₵{total_sales:,.2f} with average transaction of GH₵{avg_sales:,.2f}")
            
            if sales_growth is not None:
                if sales_growth > 0:
                    findings.append(f"📈 Sales showing positive growth of {sales_growth:.1f}%")
                elif sales_growth < -5:
                    findings.append(f"⚠️ Sales declined by {abs(sales_growth):.1f}% - attention needed")
                else:
                    findings.append(f"📊 Sales relatively stable with {sales_growth:.1f}% change")
        
        # Regional performance
        if 'region' in df.columns and 'sales' in df.columns:
            regional_sales = df.groupby('region')['sales'].sum().sort_values(ascending=False)
            top_region = regional_sales.index[0]
            top_region_share = (regional_sales.iloc[0] / regional_sales.sum()) * 100
            
            findings.append(f"🏆 {top_region} is top performing region with {top_region_share:.1f}% of total sales")
            
            if len(regional_sales) > 1:
                performance_gap = ((regional_sales.iloc[0] - regional_sales.iloc[1]) / regional_sales.iloc[1]) * 100
                findings.append(f"Performance gap: {performance_gap:.1f}% between top and second regions")
        
        # Product performance
        if 'product' in df.columns and 'sales' in df.columns:
            product_sales = df.groupby('product')['sales'].sum().sort_values(ascending=False)
            top_product = product_sales.index[0]
            product_concentration = (product_sales.iloc[0] / product_sales.sum()) * 100
            
            findings.append(f"⭐ '{top_product}' is top product contributing {product_concentration:.1f}% of sales")
        
        # Customer insights
        if 'customer_type' in df.columns and 'sales' in df.columns:
            customer_analysis = df.groupby('customer_type')['sales'].agg(['sum', 'mean', 'count'])
            most_valuable = customer_analysis['sum'].idxmax()
            findings.append(f"👥 '{most_valuable}' customers generate highest total revenue")
        
        return findings
    
    def _detect_anomalies(self, df: pd.DataFrame) -> List[str]:
        """Detect anomalies in the data"""
        anomalies = []
        
        for col in df.select_dtypes(include=[np.number]).columns:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            
            if len(outliers) > 0:
                outlier_percentage = (len(outliers) / len(df)) * 100
                if outlier_percentage > 5:  # Only report significant anomalies
                    anomalies.append(f"🔍 {outlier_percentage:.1f}% of {col} values are outliers (unusually high/low)")
        
        return anomalies
    
    def _analyze_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze trends in time series data"""
        trends = {}
        
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
        
        for date_col in date_cols:
            try:
                df_sorted = df.sort_values(date_col)
                
                for numeric_col in df.select_dtypes(include=[np.number]).columns:
                    if len(df_sorted) >= 10:  # Need enough data points
                        # Calculate trend using linear regression
                        x = np.arange(len(df_sorted)).reshape(-1, 1)
                        y = df_sorted[numeric_col].values
                        
                        model = LinearRegression().fit(x, y)
                        slope = model.coef_[0]
                        r_squared = model.score(x, y)
                        
                        if r_squared > 0.3:  # Reasonable correlation
                            trend_direction = "increasing" if slope > 0 else "decreasing"
                            trend_strength = "strong" if r_squared > 0.7 else "moderate"
                            
                            trends[f"{numeric_col}_trend"] = {
                                'direction': trend_direction,
                                'strength': trend_strength,
                                'r_squared': r_squared,
                                'slope': slope
                            }
            except Exception:
                continue
        
        return trends
    
    def _find_significant_correlations(self, df: pd.DataFrame) -> List[str]:
        """Find significant correlations between variables"""
        correlations = []
        numeric_df = df.select_dtypes(include=[np.number])
        
        if len(numeric_df.columns) >= 2:
            corr_matrix = numeric_df.corr()
            
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    corr_val = corr_matrix.iloc[i, j]
                    if not pd.isna(corr_val) and abs(corr_val) > 0.6:
                        var1 = corr_matrix.columns[i]
                        var2 = corr_matrix.columns[j]
                        
                        direction = "positively" if corr_val > 0 else "negatively"
                        strength = "strongly" if abs(corr_val) > 0.8 else "moderately"
                        
                        correlations.append(f"🔗 {var1} and {var2} are {strength} {direction} correlated ({corr_val:.2f})")
        
        return correlations
    
    def _generate_forecasts(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate forecasts using different methods"""
        forecasts = {}
        
        date_cols = [col for col in df.columns if 'date' in col.lower() or pd.api.types.is_datetime64_any_dtype(df[col])]
        
        for date_col in date_cols:
            try:
                df_sorted = df.sort_values(date_col).copy()
                
                for numeric_col in df.select_dtypes(include=[np.number]).columns:
                    if len(df_sorted) >= 30:  # Need enough data for forecasting
                        
                        # Prepare data for Prophet
                        prophet_df = pd.DataFrame({
                            'ds': pd.to_datetime(df_sorted[date_col]),
                            'y': df_sorted[numeric_col]
                        })
                        
                        try:
                            # Prophet forecast
                            model = Prophet(daily_seasonality=False, yearly_seasonality=True)
                            model.fit(prophet_df)
                            
                            future = model.make_future_dataframe(periods=30)  # 30 days ahead
                            forecast = model.predict(future)
                            
                            # Get last actual value and first forecast value
                            last_actual = prophet_df['y'].iloc[-1]
                            next_forecast = forecast['yhat'].iloc[-30]  # First forecast value
                            
                            change_percent = ((next_forecast - last_actual) / last_actual) * 100
                            
                            forecasts[f"{numeric_col}_forecast"] = {
                                'method': 'Prophet',
                                'next_30_days_change': change_percent,
                                'trend': 'increasing' if change_percent > 0 else 'decreasing',
                                'confidence': 'high' if abs(change_percent) < 10 else 'moderate'
                            }
                            
                        except Exception:
                            # Fallback to simple linear regression
                            x = np.arange(len(df_sorted)).reshape(-1, 1)
                            y = df_sorted[numeric_col].values
                            
                            model = LinearRegression().fit(x, y)
                            
                            # Predict next 30 periods
                            future_x = np.arange(len(df_sorted), len(df_sorted) + 30).reshape(-1, 1)
                            future_pred = model.predict(future_x)
                            
                            current_avg = df_sorted[numeric_col].tail(7).mean()  # Last week average
                            future_avg = future_pred[:7].mean()  # Next week prediction
                            
                            change_percent = ((future_avg - current_avg) / current_avg) * 100
                            
                            forecasts[f"{numeric_col}_forecast"] = {
                                'method': 'Linear Regression',
                                'next_period_change': change_percent,
                                'trend': 'increasing' if change_percent > 0 else 'decreasing'
                            }
            except Exception:
                continue
        
        return forecasts
    
    def _generate_recommendations(self, df: pd.DataFrame, query: str) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Sales-based recommendations
        if 'sales' in df.columns:
            recent_sales = df['sales'].tail(10).mean() if len(df) >= 10 else df['sales'].mean()
            overall_avg = df['sales'].mean()
            
            if recent_sales < overall_avg * 0.9:
                recommendations.append("📉 Recent sales below average - consider promotional campaigns or market research")
            elif recent_sales > overall_avg * 1.1:
                recommendations.append("📈 Recent sales above average - consider scaling operations or expanding inventory")
        
        # Regional recommendations
        if 'region' in df.columns and 'sales' in df.columns:
            regional_performance = df.groupby('region')['sales'].mean()
            underperforming_regions = regional_performance[regional_performance < regional_performance.mean() * 0.8]
            
            if len(underperforming_regions) > 0:
                regions_list = ', '.join(underperforming_regions.index[:3])
                recommendations.append(f"🎯 Focus marketing efforts on underperforming regions: {regions_list}")
        
        # Product recommendations
        if 'product' in df.columns and 'sales' in df.columns:
            product_performance = df.groupby('product')['sales'].sum()
            top_products = product_performance.nlargest(3)
            
            recommendations.append(f"⭐ Double down on top products: {', '.join(top_products.index)}")
        
        # Query-specific recommendations
        query_lower = query.lower()
        if 'growth' in query_lower:
            recommendations.append("🚀 For growth: focus on top-performing segments and expand to similar markets")
        
        if 'revenue' in query_lower or 'profit' in query_lower:
            recommendations.append("💰 For revenue optimization: analyze profit margins by product and customer segment")
        
        return recommendations
    
    def _add_ghana_context(self, df: pd.DataFrame) -> List[str]:
        """Add Ghana-specific business context"""
        context_insights = []
        
        # Check for Ghana-specific patterns
        if 'region' in df.columns:
            regions = df['region'].unique()
            ghana_regions = ['Greater Accra', 'Ashanti', 'Northern', 'Western', 'Eastern']
            
            if any(region in str(regions) for region in ghana_regions):
                context_insights.append("🇬🇭 Ghana market detected - consider seasonal variations and regional preferences")
                context_insights.append("💡 Leverage mobile money payments (MTN, Vodafone Cash) for broader market reach")
        
        # Seasonal considerations for Ghana
        if 'date' in df.columns:
            try:
                df['month'] = pd.to_datetime(df['date']).dt.month
                festive_months = df[df['month'].isin([11, 12, 1])]  # Nov, Dec, Jan
                
                if len(festive_months) > 0 and 'sales' in df.columns:
                    festive_sales = festive_months['sales'].mean()
                    regular_sales = df[~df['month'].isin([11, 12, 1])]['sales'].mean()
                    
                    if festive_sales > regular_sales * 1.2:
                        context_insights.append("🎄 Strong festive season performance - prepare inventory for Nov-Jan peak")
            except:
                pass
        
        context_insights.append("🌍 Consider export opportunities through Ghana Export Promotion Authority")
        
        return context_insights
    
    def _calculate_period_over_period_growth(self, df: pd.DataFrame, column: str) -> float:
        """Calculate period over period growth"""
        if len(df) < 10:
            return None
        
        try:
            # Split data into two halves
            midpoint = len(df) // 2
            first_half = df.iloc[:midpoint][column].mean()
            second_half = df.iloc[midpoint:][column].mean()
            
            if first_half > 0:
                growth = ((second_half - first_half) / first_half) * 100
                return growth
        except:
            pass
        
        return None
    
    def format_insights_summary(self, insights: Dict[str, Any]) -> str:
        """Format insights into a readable summary"""
        summary_parts = []
        
        # Key findings
        if insights['key_findings']:
            summary_parts.append("🔍 KEY FINDINGS:")
            for finding in insights['key_findings']:
                summary_parts.append(f"• {finding}")
        
        # Anomalies
        if insights['anomalies']:
            summary_parts.append("\n⚠️ ANOMALIES DETECTED:")
            for anomaly in insights['anomalies']:
                summary_parts.append(f"• {anomaly}")
        
        # Trends
        if insights['trends']:
            summary_parts.append("\n📈 TREND ANALYSIS:")
            for trend_name, trend_data in insights['trends'].items():
                variable = trend_name.replace('_trend', '').replace('_', ' ').title()
                summary_parts.append(f"• {variable}: {trend_data['strength']} {trend_data['direction']} trend")
        
        # Correlations
        if insights['correlations']:
            summary_parts.append("\n🔗 SIGNIFICANT RELATIONSHIPS:")
            for correlation in insights['correlations']:
                summary_parts.append(f"• {correlation}")
        
        # Forecasts
        if insights['forecasts']:
            summary_parts.append("\n🔮 FORECASTS:")
            for forecast_name, forecast_data in insights['forecasts'].items():
                variable = forecast_name.replace('_forecast', '').replace('_', ' ').title()
                change = forecast_data.get('next_30_days_change', forecast_data.get('next_period_change', 0))
                summary_parts.append(f"• {variable}: Expected to {forecast_data['trend']} by {abs(change):.1f}% ({forecast_data['method']})")
        
        # Recommendations
        if insights['recommendations']:
            summary_parts.append("\n💡 RECOMMENDATIONS:")
            for recommendation in insights['recommendations']:
                summary_parts.append(f"• {recommendation}")
        
        # Ghana context
        if insights['ghana_context']:
            summary_parts.append("\n🇬🇭 GHANA MARKET INSIGHTS:")
            for context in insights['ghana_context']:
                summary_parts.append(f"• {context}")
        
        return "\n".join(summary_parts)