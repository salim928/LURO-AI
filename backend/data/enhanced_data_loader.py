import pandas as pd
import json
import pyarrow.parquet as pq
from sqlalchemy import create_engine
from google.oauth2.credentials import Credentials
import gspread
from pymongo import MongoClient
from typing import Optional, Dict, Any, List
import os
from .data_loader import DataLoader

class EnhancedDataLoader(DataLoader):
    """Enhanced data loader with multiple input source support"""
    
    def __init__(self):
        super().__init__()
        self.supported_formats = {
            '.csv': self.load_csv,
            '.xlsx': self.load_excel, 
            '.json': self.load_json,
            '.parquet': self.load_parquet
        }
        self.database_connectors = {
            'postgresql': self.connect_postgresql,
            'mysql': self.connect_mysql,
            'mongodb': self.connect_mongodb,
            'mssql': self.connect_mssql
        }
        
    def load_excel(self, file_path: str, sheet_name: str = None) -> pd.DataFrame:
        """Load Excel file with support for multiple sheets"""
        try:
            if sheet_name:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
            else:
                # Load first sheet by default
                df = pd.read_excel(file_path)
            
            # Apply same preprocessing as CSV
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"Error loading Excel file: {str(e)}")
    
    def load_json(self, file_path: str) -> pd.DataFrame:
        """Load JSON file and convert to DataFrame"""
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Handle different JSON structures
            if isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                # If it's a dict, try to find the data array
                if 'data' in data:
                    df = pd.DataFrame(data['data'])
                elif 'records' in data:
                    df = pd.DataFrame(data['records'])
                else:
                    # Convert dict to single row DataFrame
                    df = pd.DataFrame([data])
            else:
                raise ValueError("Unsupported JSON structure")
            
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"Error loading JSON file: {str(e)}")
    
    def load_parquet(self, file_path: str) -> pd.DataFrame:
        """Load Parquet file"""
        try:
            table = pq.read_table(file_path)
            df = table.to_pandas()
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"Error loading Parquet file: {str(e)}")
    
    def connect_postgresql(self, connection_params: Dict[str, Any], query: str) -> pd.DataFrame:
        """Connect to PostgreSQL and execute query"""
        try:
            connection_string = f"postgresql://{connection_params['user']}:{connection_params['password']}@{connection_params['host']}:{connection_params.get('port', 5432)}/{connection_params['database']}"
            engine = create_engine(connection_string)
            df = pd.read_sql(query, engine)
            engine.dispose()
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"PostgreSQL connection failed: {str(e)}")
    
    def connect_mysql(self, connection_params: Dict[str, Any], query: str) -> pd.DataFrame:
        """Connect to MySQL and execute query"""
        try:
            connection_string = f"mysql+pymysql://{connection_params['user']}:{connection_params['password']}@{connection_params['host']}:{connection_params.get('port', 3306)}/{connection_params['database']}"
            engine = create_engine(connection_string)
            df = pd.read_sql(query, engine)
            engine.dispose()
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"MySQL connection failed: {str(e)}")
    
    def connect_mongodb(self, connection_params: Dict[str, Any], collection: str, query: Dict = None) -> pd.DataFrame:
        """Connect to MongoDB and fetch data"""
        try:
            client = MongoClient(f"mongodb://{connection_params['host']}:{connection_params.get('port', 27017)}/")
            db = client[connection_params['database']]
            col = db[collection]
            
            if query is None:
                query = {}
            
            data = list(col.find(query))
            client.close()
            
            if not data:
                raise ValueError("No data found with the given query")
            
            df = pd.DataFrame(data)
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"MongoDB connection failed: {str(e)}")
    
    def connect_mssql(self, connection_params: Dict[str, Any], query: str) -> pd.DataFrame:
        """Connect to MS SQL Server and execute query"""
        try:
            connection_string = f"mssql+pyodbc://{connection_params['user']}:{connection_params['password']}@{connection_params['server']}/{connection_params['database']}?driver=ODBC+Driver+17+for+SQL+Server"
            engine = create_engine(connection_string)
            df = pd.read_sql(query, engine)
            engine.dispose()
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"MS SQL connection failed: {str(e)}")
    
    def connect_google_sheets(self, spreadsheet_id: str, worksheet_name: str = None, credentials_path: str = None) -> pd.DataFrame:
        """Connect to Google Sheets"""
        try:
            if credentials_path:
                gc = gspread.service_account(filename=credentials_path)
            else:
                # Use environment credentials
                gc = gspread.service_account_from_dict(json.loads(os.environ['GOOGLE_SHEETS_CREDENTIALS']))
            
            spreadsheet = gc.open_by_key(spreadsheet_id)
            
            if worksheet_name:
                worksheet = spreadsheet.worksheet(worksheet_name)
            else:
                worksheet = spreadsheet.get_worksheet(0)  # First sheet
            
            data = worksheet.get_all_records()
            df = pd.DataFrame(data)
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"Google Sheets connection failed: {str(e)}")
    
    def connect_bigquery(self, project_id: str, query: str, credentials_path: str = None) -> pd.DataFrame:
        """Connect to Google BigQuery"""
        try:
            if credentials_path:
                df = pd.read_gbq(query, project_id=project_id, credentials=credentials_path)
            else:
                df = pd.read_gbq(query, project_id=project_id)
            
            return self.preprocess_data(df)
            
        except Exception as e:
            raise Exception(f"BigQuery connection failed: {str(e)}")
    
    def detect_file_type(self, file_path: str) -> str:
        """Detect file type from extension"""
        _, ext = os.path.splitext(file_path)
        return ext.lower()
    
    def load_from_source(self, source_config: Dict[str, Any]) -> pd.DataFrame:
        """Universal loader that handles different source types"""
        source_type = source_config.get('type')
        
        if source_type == 'file':
            file_path = source_config['path']
            file_type = self.detect_file_type(file_path)
            
            if file_type in self.supported_formats:
                return self.supported_formats[file_type](file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_type}")
        
        elif source_type == 'database':
            db_type = source_config['database_type']
            if db_type in self.database_connectors:
                return self.database_connectors[db_type](
                    source_config['connection_params'],
                    source_config['query']
                )
            else:
                raise ValueError(f"Unsupported database type: {db_type}")
        
        elif source_type == 'google_sheets':
            return self.connect_google_sheets(
                source_config['spreadsheet_id'],
                source_config.get('worksheet_name'),
                source_config.get('credentials_path')
            )
        
        elif source_type == 'bigquery':
            return self.connect_bigquery(
                source_config['project_id'],
                source_config['query'],
                source_config.get('credentials_path')
            )
        
        else:
            raise ValueError(f"Unsupported source type: {source_type}")