# backend/agents/cleaning_agent.py
import pandas as pd
import numpy as np
from typing import Tuple, Dict

class DataCleaner:
    def __init__(self):
        pass
    
    def clean_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict]:
        """
        Clean the dataframe and return cleaned version with summary
        """
        cleaned_df = df.copy()
        summary = {
            "missing_values": 0,
            "duplicates_removed": 0,
            "outliers_handled": 0,
            "columns_standardized": []
        }
        
        # Handle missing values
        initial_missing = cleaned_df.isnull().sum().sum()
        
        # Fill numerical missing values with median
        numeric_cols = cleaned_df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            if cleaned_df[col].isnull().sum() > 0:
                cleaned_df[col].fillna(cleaned_df[col].median(), inplace=True)
        
        # Fill categorical missing values with mode
        categorical_cols = cleaned_df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if cleaned_df[col].isnull().sum() > 0:
                mode_value = cleaned_df[col].mode()
                if len(mode_value) > 0:
                    cleaned_df[col].fillna(mode_value[0], inplace=True)
                else:
                    cleaned_df[col].fillna('Unknown', inplace=True)
        
        final_missing = cleaned_df.isnull().sum().sum()
        summary["missing_values"] = initial_missing - final_missing
        
        # Remove duplicates
        initial_rows = len(cleaned_df)
        cleaned_df = cleaned_df.drop_duplicates()
        summary["duplicates_removed"] = initial_rows - len(cleaned_df)
        
        # Handle outliers using IQR method for numerical columns
        for col in numeric_cols:
            Q1 = cleaned_df[col].quantile(0.25)
            Q3 = cleaned_df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers_before = len(cleaned_df[(cleaned_df[col] < lower_bound) | (cleaned_df[col] > upper_bound)])
            
            # Cap outliers instead of removing them
            cleaned_df[col] = np.where(cleaned_df[col] < lower_bound, lower_bound, cleaned_df[col])
            cleaned_df[col] = np.where(cleaned_df[col] > upper_bound, upper_bound, cleaned_df[col])
            
            summary["outliers_handled"] += outliers_before
        
        # Standardize column names
        original_columns = cleaned_df.columns.tolist()
        cleaned_df.columns = [col.lower().replace(' ', '_').replace('-', '_') for col in cleaned_df.columns]
        summary["columns_standardized"] = list(zip(original_columns, cleaned_df.columns.tolist()))
        
        return cleaned_df, summary