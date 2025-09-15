# backend/agents/report_agent.py
import pandas as pd
from typing import Dict, Any

class ReportGenerator:
    def __init__(self):
        pass
    
    def generate_report(self, df: pd.DataFrame, query: str, cleaning_summary: Dict, 
                       stats_results: Dict, rag_insights: str = "") -> str:
        """
        Generate a comprehensive business report
        """
        report_sections = []
        
        # Header
        report_sections.append("🤖 LURO-AI ANALYSIS REPORT")
        report_sections.append("=" * 50)
        
        # Executive Summary
        report_sections.append(self._generate_executive_summary(df, stats_results))
        
        # Data Quality Summary
        report_sections.append(self._generate_data_quality_summary(cleaning_summary, df))
        
        # Key Insights
        report_sections.append(self._generate_key_insights(stats_results, df))
        
        # Business Recommendations
        report_sections.append(self._generate_recommendations(stats_results, query, df))
        
        # RAG Enhanced Insights
        if rag_insights:
            report_sections.append("\n🔍 ENHANCED INSIGHTS FROM DATA CONTEXT:")
            report_sections.append(rag_insights)
        
        # Footer
        report_sections.append(self._generate_footer())
        
        return "\n\n".join(report_sections)
    
    def _generate_executive_summary(self, df: pd.DataFrame, stats_results: Dict) -> str:
        """Generate executive summary"""
        summary = ["📊 EXECUTIVE SUMMARY"]
        summary.append("-" * 25)
        
        # Basic dataset info
        summary.append(f"Dataset Size: {len(df):,} records across {len(df.columns)} variables")
        
        # Key metrics from sales data if available
        if "sales_analysis" in stats_results.get("query_specific", {}):
            sales_info = stats_results["query_specific"]["sales_analysis"]
            summary.append(f"Total Revenue: GH₵{sales_info['total_sales']:,.2f}")
            summary.append(f"Average Transaction: GH₵{sales_info['average_sales']:,.2f}")
            
            growth = sales_info.get('sales_growth', 0)
            if growth > 0:
                summary.append(f"Growth Rate: +{growth}% 📈")
            elif growth < 0:
                summary.append(f"Growth Rate: {growth}% 📉")
        
        # Regional insights if available
        if "regional_breakdown" in stats_results.get("query_specific", {}):
            summary.append("Multi-regional data detected - see regional analysis below")
        
        return "\n".join(summary)
    
    def _generate_data_quality_summary(self, cleaning_summary: Dict, df: pd.DataFrame) -> str:
        """Generate data quality summary"""
        quality_report = ["🔧 DATA QUALITY ASSESSMENT"]
        quality_report.append("-" * 30)
        
        quality_report.append(f"✅ Records processed: {len(df):,}")
        
        if cleaning_summary.get("missing_values", 0) > 0:
            quality_report.append(f"🔄 Missing values handled: {cleaning_summary['missing_values']}")
        else:
            quality_report.append("✨ No missing values detected")
        
        if cleaning_summary.get("duplicates_removed", 0) > 0:
            quality_report.append(f"🗑️ Duplicate records removed: {cleaning_summary['duplicates_removed']}")
        
        if cleaning_summary.get("outliers_handled", 0) > 0:
            quality_report.append(f"📊 Outliers normalized: {cleaning_summary['outliers_handled']}")
        
        quality_report.append("✅ Data is clean and ready for analysis")
        
        return "\n".join(quality_report)
    
    def _generate_key_insights(self, stats_results: Dict, df: pd.DataFrame) -> str:
        """Generate key business insights"""
        insights = ["🎯 KEY BUSINESS INSIGHTS"]
        insights.append("-" * 25)
        
        # Correlation insights
        correlations = stats_results.get("correlations", {}).get("strong_correlations", [])
        if correlations:
            insights.append("📈 SIGNIFICANT RELATIONSHIPS FOUND:")
            for corr in correlations[:3]:  # Top 3 correlations
                direction = "positively" if corr["correlation"] > 0 else "negatively"
                insights.append(f"• {corr['var1']} and {corr['var2']} are {direction} correlated ({corr['correlation']:.2f})")
        
        # Trend insights
        trends = stats_results.get("trends", {})
        if trends:
            insights.append("\n📊 TREND ANALYSIS:")
            for trend_name, trend_data in trends.items():
                if trend_data.get("strength") in ["strong", "moderate"]:
                    direction = trend_data["direction"]
                    strength = trend_data["strength"]
                    variable = trend_name.replace("_over_time", "").replace("_", " ").title()
                    insights.append(f"• {variable} shows {strength} {direction} trend")
        
        # Query-specific insights
        query_results = stats_results.get("query_specific", {})
        
        if "top_products" in query_results:
            insights.append("\n🏆 TOP PERFORMING PRODUCTS:")
            products = list(query_results["top_products"].items())[:3]
            for product, count in products:
                insights.append(f"• {product}: {count} transactions")
        
        if "regional_breakdown" in query_results:
            insights.append("\n🌍 REGIONAL PERFORMANCE DETECTED:")
            insights.append("• Multi-regional data available for geographic analysis")
        
        return "\n".join(insights)
    
    def _generate_recommendations(self, stats_results: Dict, query: str, df: pd.DataFrame) -> str:
        """Generate actionable business recommendations"""
        recommendations = ["💡 ACTIONABLE RECOMMENDATIONS"]
        recommendations.append("-" * 35)
        
        query_lower = query.lower()
        query_results = stats_results.get("query_specific", {})
        
        # Sales-specific recommendations
        if "sales_analysis" in query_results:
            sales_data = query_results["sales_analysis"]
            growth = sales_data.get("sales_growth", 0)
            
            if growth > 5:
                recommendations.append("🚀 GROWTH OPPORTUNITIES:")
                recommendations.append("• Strong sales growth detected - consider scaling operations")
                recommendations.append("• Invest in inventory management for growing demand")
            elif growth < -5:
                recommendations.append("⚠️ ATTENTION NEEDED:")
                recommendations.append("• Sales declining - review pricing and marketing strategy")
                recommendations.append("• Analyze competitor activities and market conditions")
            else:
                recommendations.append("📊 STABILITY FOCUS:")
                recommendations.append("• Sales stable - focus on customer retention")
                recommendations.append("• Explore new market segments for growth")
        
        # Regional recommendations
        if "regional_breakdown" in query_results:
            recommendations.append("\n🎯 REGIONAL STRATEGY:")
            recommendations.append("• Analyze top-performing regions for expansion")
            recommendations.append("• Investigate underperforming areas for improvement")
            recommendations.append("• Consider region-specific marketing campaigns")
        
        # Product recommendations
        if "top_products" in query_results:
            recommendations.append("\n📦 PRODUCT STRATEGY:")
            recommendations.append("• Focus marketing budget on top-performing products")
            recommendations.append("• Investigate why certain products perform better")
            recommendations.append("• Consider discontinuing consistently poor performers")
        
        # Ghana-specific recommendations
        if "ghana" in query_lower or any("ghana" in str(val).lower() for val in df.values.flatten() if pd.notna(val)):
            recommendations.append("\n🇬🇭 GHANA MARKET INSIGHTS:")
            recommendations.append("• Consider seasonal patterns in Ghanaian market")
            recommendations.append("• Leverage mobile money payment systems")
            recommendations.append("• Focus on Greater Accra and Ashanti regions for growth")
        
        # General business recommendations
        recommendations.append("\n🔄 OPERATIONAL IMPROVEMENTS:")
        recommendations.append("• Implement data collection automation")
        recommendations.append("• Set up monthly performance dashboards")
        recommendations.append("• Consider predictive analytics for forecasting")
        
        return "\n".join(recommendations)
    
    def _generate_footer(self) -> str:
        """Generate report footer"""
        footer = [
            "=" * 50,
            "📈 Report generated by AI Data Scientist",
            "🤖 For detailed analysis or custom insights, contact your AI consultant",
            f"📅 Generated on: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}"
        ]
        return "\n".join(footer)