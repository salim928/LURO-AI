"""
Utilities Package
Helper functions and utility classes
"""

from .file_helpers import (
    create_temp_file,
    cleanup_temp_file, 
    validate_csv_file,
    get_file_info
)
from .business_insights import BusinessInsightGenerator

# Export utility functions and classes
__all__ = [
    'create_temp_file',
    'cleanup_temp_file',
    'validate_csv_file', 
    'get_file_info',
    'BusinessInsightGenerator'
]

# Utility constants
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = ['.csv']
TEMP_FILE_PREFIX = 'ai_data_scientist_'

# Ghana business utilities
GHANA_BUSINESS_HOURS = {
    'weekdays': {'start': '08:00', 'end': '17:00'},
    'saturday': {'start': '08:00', 'end': '14:00'},
    'sunday': 'closed'
}

GHANA_HOLIDAYS = [
    'New Year\'s Day',
    'Independence Day', 
    'Good Friday',
    'Easter Monday',
    'May Day',
    'Eid al-Fitr',
    'Founders\' Day',
    'Kwame Nkrumah Memorial Day',
    'Farmers\' Day',
    'Christmas Day',
    'Boxing Day'
]

def get_ghana_business_context():
    """
    Get Ghana business context including holidays and hours
    
    Returns:
        dict: Ghana business context
    """
    return {
        'business_hours': GHANA_BUSINESS_HOURS,
        'holidays': GHANA_HOLIDAYS
    }

# File validation utilities
def is_valid_file_size(file_size: int) -> bool:
    """
    Check if file size is within limits
    
    Args:
        file_size (int): File size in bytes
    
    Returns:
        bool: True if valid, False otherwise
    """
    return 0 < file_size <= MAX_FILE_SIZE

def is_allowed_extension(filename: str) -> bool:
    """
    Check if file extension is allowed
    
    Args:
        filename (str): Name of the file
    
    Returns:
        bool: True if allowed, False otherwise
    """
    import os
    _, ext = os.path.splitext(filename)
    return ext.lower() in ALLOWED_EXTENSIONS

# Error handling utilities
class UtilityError(Exception):
    """Base exception for utility functions"""
    pass

class FileValidationError(UtilityError):
    """Exception raised when file validation fails"""
    pass

class BusinessContextError(UtilityError):
    """Exception raised when business context processing fails"""
    pass