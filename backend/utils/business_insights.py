import pandas as pd
import numpy as np
from typing import Dict, List, Any
from datetime import datetime, timedelta

class BusinessInsightGenerator:
    """Generate Ghana-specific business insights"""
    
    def __init__(self):
        # Ghana-specific business context
        self.ghana_regions = [
            'Greater Accra', 'Ashanti', 'Northern', 'Western', 'Eastern',
            'Volta', 'Upper East', 'Upper West', 'Central', 'Brong-Ahafo'
        ]
        
        self.ghana_business_context = {
            'peak_months': [11, 12, 1],  # Nov, Dec, Jan (festive season)
            'major_cities': ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
            'currencies': ['GHS', 'GH₵', 'Cedis'],
            'business_sectors': ['retail', 'agriculture', 'manufacturing', 'services']
        }
    
    def generate_regional_insights(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate region-specific insights for Ghana"""
        insights = {'regional_analysis': {}}
        
        # Find region column
        region_col = None
        for col in df.columns:
            if 'region' in col.lower() or 'location' in col.lower():
                region_col = col
                break
        
        if region_col and region_col in df.columns:
            regional_data = df.groupby(region_col).agg({
                col: ['sum', 'mean', 'count'] for col in df.select_dtypes(include=[np.number]).columns
            }).round(2)
            
            # Identify top performing regions
            if 'sales' in df.columns:
                top_regions = df.groupby(region_col)['sales'].sum().sort_values(ascending=False)
                insights['top_regions'] = top_regions.head(3).to_dict()
                
                # Ghana-specific recommendations
                ghana_regions_in_data = [r for r in top_regions.index if any(gr in r for gr in self.ghana_regions)]
                if ghana_regions_in_data:
                    insights['ghana_specific'] = {
                        'recommendation': f"Focus expansion on {ghana_regions_in_data[0]} - highest performer in Ghana",
                        'context': "Greater Accra and Ashanti typically offer best market opportunities"
                    }
        
        return insights
    
    def generate_seasonal_insights(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate seasonal business insights"""
        insights = {'seasonal_analysis': {}}
        
        # Find date column
        date_col = None
        for col in df.columns:
            if 'date' in col.lower() or 'time' in col.lower():
                if pd.api.types.is_datetime64_any_dtype(df[col]):
                    date_col = col
                    break
        
        if date_col:
            df_with_date = df.copy()
            df_with_date['month'] = df_with_date[date_col].dt.month
            df_with_date['quarter'] = df_with_date[date_col].dt.quarter
            
            # Monthly analysis
            if 'sales' in df.columns:
                monthly_sales = df_with_date.groupby('month')['sales'].mean()
                peak_months = monthly_sales.nlargest(3).index.tolist()
                
                insights['peak_months'] = peak_months
                
                # Ghana festive season check
                festive_overlap = [m for m in peak_months if m in self.ghana_business_context['peak_months']]
                if festive_overlap:
                    insights['ghana_seasonal'] = {
                        'pattern': 'Festive season boost detected',
                        'recommendation': 'Prepare inventory for November-January peak season',
                        'context': 'Ghana experiences increased spending during festive periods'
                    }
        
        return insights
    
    def generate_product_insights(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate product performance insights"""
        insights = {'product_analysis': {}}
        
        # Find product column
        product_col = None
        for col in df.columns:
            if 'product' in col.lower() or 'item' in col.lower():
                product_col = col
                break
        
        if product_col and 'sales' in df.columns:
            product_performance = df.groupby(product_col)['sales'].agg(['sum', 'mean', 'count']).round(2)
            
            # Top performers
            top_products = product_performance.sort_values('sum', ascending=False).head(5)
            insights['top_products'] = top_products.to_dict()
            
            # Ghana-specific product insights
            ghana_products = ['kente', 'palm oil', 'shea', 'cocoa', 'plantain', 'cassava', 'yam']
            products_in_data = df[product_col].str.lower().values
            
            detected_ghana_products = []
            for ghana_prod in ghana_products:
                if any(ghana_prod in prod for prod in products_in_data):
                    detected_ghana_products.append(ghana_prod)
            
            if detected_ghana_products:
                insights['ghana_products'] = {
                    'detected': detected_ghana_products,
                    'recommendation': 'Local products detected - consider export opportunities',
                    'context': 'Ghana products have strong international demand'
                }
        
        return insights
    
    def generate_growth_recommendations(self, df: pd.DataFrame) -> List[str]:
        """Generate specific growth recommendations for Ghana SMEs"""
        recommendations = []
        
        # Revenue analysis
        if 'sales' in df.columns:
            total_sales = df['sales'].sum()
            avg_sales = df['sales'].mean()
            
            if total_sales < 50000:  # Small business
                recommendations.extend([
                    "Consider mobile money integration (MTN Mobile Money, Vodafone Cash) to increase sales",
                    "Explore partnerships with local distributors in Greater Accra and Ashanti",
                    "Apply for SME support from Ghana Enterprise Agency or NBSSI"
                ])
            elif total_sales < 500000:  # Medium business
                recommendations.extend([
                    "Consider expanding to underserved regions like Northern or Upper regions",
                    "Explore export opportunities through Ghana Export Promotion Authority",
                    "Implement digital marketing to reach urban customers in Accra and Kumasi"
                ])
            else:  # Larger business
                recommendations.extend([
                    "Consider regional expansion across West Africa",
                    "Explore manufacturing partnerships to reduce import dependency",
                    "Apply for export financing through Ghana EXIM Bank"
                ])
        
        # Regional recommendations
        if any('region' in col.lower() for col in df.columns):
            recommendations.append("Focus on Greater Accra and Ashanti regions for highest ROI")
        
        # General Ghana business recommendations
        recommendations.extend([
            "Leverage Ghana's strategic location as gateway to West African markets",
            "Consider seasonal inventory planning for festive periods (Nov-Jan)",
            "Explore digital payment solutions popular in Ghana (mobile money, bank apps)"
        ])
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def analyze_customer_segments(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze customer segments with Ghana context"""
        insights = {'customer_analysis': {}}
        
        # Find customer-related columns
        customer_cols = [col for col in df.columns if 'customer' in col.lower() or 'client' in col.lower()]
        
        for col in customer_cols:
            if df[col].dtype == 'object':  # Categorical data
                segment_analysis = df.groupby(col).agg({
                    'sales': ['sum', 'mean', 'count'] if 'sales' in df.columns else 'count'
                }).round(2)
                
                insights[f'{col}_segments'] = segment_analysis.to_dict()
                
                # Ghana-specific customer insights
                segments = df[col].str.lower().unique()
                
                if 'export' in segments:
                    insights['export_opportunity'] = "Export customers detected - Ghana's strategic location favors international trade"
                
                if 'tourist' in segments:
                    insights['tourism_opportunity'] = "Tourist market detected - leverage Ghana's growing tourism industry"
        
        return insights
    
    def generate_competitive_analysis(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate competitive insights for Ghana market"""
        insights = {'competitive_context': {}}
        
        # Market positioning insights
        if 'sales' in df.columns:
            avg_transaction = df['sales'].mean()
            
            if avg_transaction < 100:
                insights['market_position'] = "Mass market focus - compete on accessibility and convenience"
            elif avg_transaction < 1000:
                insights['market_position'] = "Middle market focus - emphasize quality and value"
            else:
                insights['market_position'] = "Premium market focus - highlight exclusivity and quality"
        
        # Ghana market context
        insights['ghana_context'] = {
            'opportunities': [
                "Growing middle class in urban areas",
                "Increasing digital adoption",
                "Government support for SME development",
                "Strategic location for West African trade"
            ],
            'challenges': [
                "Infrastructure limitations in rural areas",
                "Currency fluctuation considerations",
                "Competition from imported goods",
                "Seasonal demand variations"
            ]
        }
        
        return insights