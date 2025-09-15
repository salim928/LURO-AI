# backend/agents/stats_agent.py
import pandas as pd
import numpy as np
from typing import Dict, Any
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

class StatsAnalyzer:
    def __init__(self):
        pass
    
    def analyze(self, df: pd.DataFrame, query: str) -> Dict[str, Any]:
        """
        Perform statistical analysis on the dataframe
        """
        results = {
            "basic_stats": self._get_basic_stats(df),
            "correlations": self._get_correlations(df),
            "trends": self._detect_trends(df),
            "distributions": self._analyze_distributions(df),
            "query_specific": self._query_specific_analysis(df, query)
        }
        
        return results
    
    def _get_basic_stats(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Get basic statistical measures"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) == 0:
            return {"message": "No numeric columns found"}
        
        stats_dict = {}
        for col in numeric_cols:
            stats_dict[col] = {
                "mean": float(df[col].mean()),
                "median": float(df[col].median()),
                "std": float(df[col].std()),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "count": int(df[col].count())
            }
        
        return stats_dict
    
    def _get_correlations(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate correlations between numeric variables"""
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.shape[1] < 2:
            return {"message": "Not enough numeric columns for correlation analysis"}
        
        corr_matrix = numeric_df.corr()
        
        # Find strongest correlations
        correlations = []
        for i in range(len(corr_matrix.columns)):
            for j in range(i+1, len(corr_matrix.columns)):
                corr_val = corr_matrix.iloc[i, j]
                if not np.isnan(corr_val) and abs(corr_val) > 0.5:
                    correlations.append({
                        "var1": corr_matrix.columns[i],
                        "var2": corr_matrix.columns[j],
                        "correlation": float(corr_val),
                        "strength": "strong" if abs(corr_val) > 0.7 else "moderate"
                    })
        
        return {
            "strong_correlations": sorted(correlations, key=lambda x: abs(x["correlation"]), reverse=True)
        }
    
    def _detect_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Detect trends in time-series data"""
        date_cols = df.select_dtypes(include=['datetime64']).columns
        if len(date_cols) == 0:
            # Try to find date columns by name
            potential_date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
            if potential_date_cols:
                try:
                    df[potential_date_cols[0]] = pd.to_datetime(df[potential_date_cols[0]])
                    date_cols = [potential_date_cols[0]]
                except:
                    return {"message": "No valid date columns found"}
            else:
                return {"message": "No date columns found for trend analysis"}
        
        trends = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for date_col in date_cols:
            for num_col in numeric_cols:
                try:
                    # Sort by date and calculate trend
                    temp_df = df[[date_col, num_col]].dropna().sort_values(date_col)
                    if len(temp_df) > 3:
                        x = np.arange(len(temp_df))
                        y = temp_df[num_col].values
                        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
                        
                        trend_direction = "increasing" if slope > 0 else "decreasing"
                        trend_strength = "strong" if abs(r_value) > 0.7 else "moderate" if abs(r_value) > 0.3 else "weak"
                        
                        trends[f"{num_col}_over_time"] = {
                            "slope": float(slope),
                            "direction": trend_direction,
                            "strength": trend_strength,
                            "r_squared": float(r_value**2),
                            "p_value": float(p_value)
                        }
                except:
                    continue
        
        return trends
    
    def _analyze_distributions(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze distributions of numeric variables"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        distributions = {}
        for col in numeric_cols:
            data = df[col].dropna()
            if len(data) > 10:
                # Test for normality
                _, p_value = stats.normaltest(data)
                is_normal = p_value > 0.05
                
                # Calculate skewness and kurtosis
                skewness = float(stats.skew(data))
                kurtosis = float(stats.kurtosis(data))
                
                distributions[col] = {
                    "is_normal": is_normal,
                    "skewness": skewness,
                    "kurtosis": kurtosis,
                    "distribution_type": self._classify_distribution(skewness, is_normal)
                }
        
        return distributions
    
    def _classify_distribution(self, skewness: float, is_normal: bool) -> str:
        """Classify distribution type based on skewness and normality"""
        if is_normal:
            return "normal"
        elif skewness > 1:
            return "highly_right_skewed"
        elif skewness > 0.5:
            return "moderately_right_skewed"
        elif skewness < -1:
            return "highly_left_skewed"
        elif skewness < -0.5:
            return "moderately_left_skewed"
        else:
            return "approximately_symmetric"
    
    def _query_specific_analysis(self, df: pd.DataFrame, query: str) -> Dict[str, Any]:
        """Perform analysis specific to the user's query"""
        query_lower = query.lower()
        results = {}
        
        # Sales analysis
        if "sales" in query_lower and "sales" in df.columns:
            sales_data = df["sales"].dropna()
            results["sales_analysis"] = {
                "total_sales": float(sales_data.sum()),
                "average_sales": float(sales_data.mean()),
                "sales_growth": self._calculate_growth_rate(df, "sales")
            }
        
        # Regional analysis
        if "region" in query_lower and "region" in df.columns:
            region_analysis = df.groupby("region").agg({
                col: ["sum", "mean", "count"] for col in df.select_dtypes(include=[np.number]).columns
            }).round(2)
            results["regional_breakdown"] = region_analysis.to_dict()
        
        # Product analysis
        if "product" in query_lower and "product" in df.columns:
            product_counts = df["product"].value_counts().head(10)
            results["top_products"] = product_counts.to_dict()
        
        # Customer analysis
        if "customer" in query_lower:
            customer_cols = [col for col in df.columns if "customer" in col.lower()]
            if customer_cols:
                for col in customer_cols:
                    if df[col].dtype == 'object':
                        results[f"{col}_distribution"] = df[col].value_counts().head(10).to_dict()
        
        return results
    
    def _calculate_growth_rate(self, df: pd.DataFrame, column: str) -> float:
        """Calculate growth rate for a numeric column over time"""
        if "date" not in df.columns:
            return 0.0
        
        try:
            df_sorted = df.sort_values("date")
            first_half = df_sorted.head(len(df_sorted)//2)[column].mean()
            second_half = df_sorted.tail(len(df_sorted)//2)[column].mean()
            
            if first_half > 0:
                growth_rate = ((second_half - first_half) / first_half) * 100
                return round(float(growth_rate), 2)
        except:
            pass
        
        return 0.0