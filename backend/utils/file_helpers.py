import os
import tempfile
import shutil
from typing import Optional
import pandas as pd

def create_temp_file(content: bytes, suffix: str = '.csv') -> str:
    """Create a temporary file with given content"""
    try:
        temp_file = tempfile.NamedTemporaryFile(mode='wb', suffix=suffix, delete=False)
        temp_file.write(content)
        temp_file.close()
        return temp_file.name
    except Exception as e:
        raise Exception(f"Failed to create temporary file: {str(e)}")

def cleanup_temp_file(file_path: str) -> bool:
    """Clean up temporary file"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            return True
        return False
    except Exception as e:
        print(f"Warning: Could not delete temp file {file_path}: {e}")
        return False

def validate_csv_file(file_path: str) -> dict:
    """Validate CSV file and return validation results"""
    validation_result = {
        'is_valid': False,
        'errors': [],
        'warnings': [],
        'file_size_mb': 0,
        'estimated_rows': 0
    }
    
    try:
        # Check file exists
        if not os.path.exists(file_path):
            validation_result['errors'].append("File does not exist")
            return validation_result
        
        # Check file size
        file_size = os.path.getsize(file_path)
        validation_result['file_size_mb'] = file_size / (1024 * 1024)
        
        if file_size > 50 * 1024 * 1024:  # 50MB limit
            validation_result['errors'].append("File too large (max 50MB)")
            return validation_result
        
        if file_size == 0:
            validation_result['errors'].append("File is empty")
            return validation_result
        
        # Try to read first few rows
        try:
            sample_df = pd.read_csv(file_path, nrows=5)
            validation_result['estimated_rows'] = len(sample_df)
            
            if len(sample_df.columns) < 2:
                validation_result['errors'].append("CSV must have at least 2 columns")
                return validation_result
            
            # Check for numeric columns
            numeric_cols = sample_df.select_dtypes(include=['number']).columns
            if len(numeric_cols) == 0:
                validation_result['warnings'].append("No numeric columns detected - analysis may be limited")
            
            validation_result['is_valid'] = True
            
        except pd.errors.EmptyDataError:
            validation_result['errors'].append("CSV file is empty or has no data")
        except pd.errors.ParserError as e:
            validation_result['errors'].append(f"CSV parsing error: {str(e)}")
        except Exception as e:
            validation_result['errors'].append(f"Error reading CSV: {str(e)}")
    
    except Exception as e:
        validation_result['errors'].append(f"File validation failed: {str(e)}")
    
    return validation_result

def get_file_info(file_path: str) -> dict:
    """Get detailed file information"""
    try:
        stat = os.stat(file_path)
        return {
            'size_bytes': stat.st_size,
            'size_mb': stat.st_size / (1024 * 1024),
            'modified_time': stat.st_mtime,
            'created_time': stat.st_ctime,
            'extension': os.path.splitext(file_path)[1].lower()
        }
    except Exception as e:
        return {'error': str(e)}