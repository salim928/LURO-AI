import pandas as pd
from typing import Optional
import os

class DataLoader:
    def __init__(self):
        pass
    
    def load_csv(self, file_path: str) -> Optional[pd.DataFrame]:
        """Load CSV file and return DataFrame"""
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    df = pd.read_csv(file_path, encoding=encoding)
                    
                    # Basic validation
                    if df.empty:
                        continue
                        
                    # Try to parse date columns
                    for col in df.columns:
                        if 'date' in col.lower() or 'time' in col.lower():
                            try:
                                df[col] = pd.to_datetime(df[col])
                            except:
                                pass  # Keep as original format if parsing fails
                    
                    return df
                    
                except UnicodeDecodeError:
                    continue
            
            raise Exception("Could not read CSV file with any supported encoding")
            
        except Exception as e:
            raise Exception(f"Error loading CSV: {str(e)}")
    
    def validate_data(self, df: pd.DataFrame) -> bool:
        """Validate that DataFrame is suitable for analysis"""
        if df is None or df.empty:
            return False
        
        if len(df.columns) < 2:
            return False
        
        # Check if at least one numeric column exists
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) == 0:
            return False
        
        return True
    
    def get_sample_data(self) -> pd.DataFrame:
        """Generate sample data for testing"""
        import numpy as np
        from datetime import datetime, timedelta
        
        # Generate sample Ghana business data
        np.random.seed(42)
        dates = [datetime(2024, 1, 1) + timedelta(days=x) for x in range(100)]
        products = ['Kente Fabric', 'Palm Oil', 'Shea Butter', 'Cocoa Products', 'Textiles']
        regions = ['Greater Accra', 'Ashanti', 'Northern', 'Western', 'Volta']
        customer_types = ['Local', 'Tourist', 'Export', 'Wholesale']
        
        data = {
            'date': np.random.choice(dates, 100),
            'product': np.random.choice(products, 100),
            'region': np.random.choice(regions, 100),
            'customer_type': np.random.choice(customer_types, 100),
            'sales': np.random.normal(2500, 800, 100).round(2),
            'quantity': np.random.randint(10, 200, 100),
            'profit_margin': np.random.uniform(0.1, 0.4, 100).round(3)
        }
        
        df = pd.DataFrame(data)
        df['sales'] = df['sales'].clip(lower=500)  # Ensure positive sales
        
        return df
    
    def load_database(self, connection_string: str, query: str) -> Optional[pd.DataFrame]:
        """Load data from database (future enhancement)"""
        # Placeholder for database connectivity
        # Could use SQLAlchemy for various database types
        try:
            import sqlalchemy as sa
            engine = sa.create_engine(connection_string)
            df = pd.read_sql(query, engine)
            return df
        except ImportError:
            raise Exception("Database functionality requires sqlalchemy: pip install sqlalchemy")
        except Exception as e:
            raise Exception(f"Database connection failed: {str(e)}")
    
    def preprocess_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Basic preprocessing of loaded data"""
        # Make a copy to avoid modifying original
        processed_df = df.copy()
        
        # Standardize column names
        processed_df.columns = [col.lower().strip().replace(' ', '_') for col in processed_df.columns]
        
        # Basic data type inference and conversion
        for col in processed_df.columns:
            # Try to convert string numbers to numeric
            if processed_df[col].dtype == 'object':
                # Check if it looks like a number
                sample_values = processed_df[col].dropna().astype(str).str.strip()
                if len(sample_values) > 0:
                    # Remove common currency symbols and commas
                    cleaned_sample = sample_values.str.replace('[GH₵$,]', '', regex=True)
                    
                    # Check if all values are numeric after cleaning
                    try:
                        pd.to_numeric(cleaned_sample)
                        # If successful, apply to whole column
                        processed_df[col] = processed_df[col].astype(str).str.replace('[GH₵$,]', '', regex=True)
                        processed_df[col] = pd.to_numeric(processed_df[col], errors='coerce')
                    except:
                        pass  # Keep as string if conversion fails
        
        return processed_df
    
    def get_data_summary(self, df: pd.DataFrame) -> dict:
        """Get summary statistics of the data"""
        summary = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'numeric_columns': len(df.select_dtypes(include=['number']).columns),
            'categorical_columns': len(df.select_dtypes(include=['object']).columns),
            'date_columns': len(df.select_dtypes(include=['datetime']).columns),
            'missing_values': df.isnull().sum().sum(),
            'memory_usage': df.memory_usage(deep=True).sum() / 1024**2,  # MB
            'columns': df.columns.tolist(),
            'dtypes': df.dtypes.to_dict()
        }
        
        # Add sample values for each column
        summary['sample_values'] = {}
        for col in df.columns:
            non_null_values = df[col].dropna()
            if len(non_null_values) > 0:
                if df[col].dtype in ['int64', 'float64']:
                    summary['sample_values'][col] = {
                        'min': float(non_null_values.min()),
                        'max': float(non_null_values.max()),
                        'mean': float(non_null_values.mean())
                    }
                else:
                    # For categorical data, show top values
                    top_values = non_null_values.value_counts().head(3).to_dict()
                    summary['sample_values'][col] = top_values
        
        return summary