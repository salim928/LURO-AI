# backend/data/__init__.py
"""
Data Package
Contains data loading, processing, and storage utilities
"""

from .data_loader import DataLoader
from .vector_store import VectorStore

# Export main classes
__all__ = [
    'DataLoader',
    'VectorStore'
]

# Supported file formats
SUPPORTED_FORMATS = {
    '.csv': 'Comma-separated values',
    '.xlsx': 'Excel spreadsheet (coming soon)',
    '.json': 'JSON data format (coming soon)',
    '.sql': 'Database connection (coming soon)'
}

# Ghana-specific data constants
GHANA_DATA_CONTEXT = {
    'regions': [
        'Greater Accra', 'Ashanti', 'Northern', 'Western', 'Eastern',
        'Volta', 'Upper East', 'Upper West', 'Central', 'Brong-Ahafo',
        'Savannah', 'Bono East', 'Ahafo', 'Oti', 'Western North', 'North East'
    ],
    'major_cities': [
        'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Sunyani',
        'Koforidua', 'Ho', 'Bolgatanga', 'Wa', 'Cape Coast'
    ],
    'currencies': ['GHS', 'GH₵', 'Cedis'],
    'common_business_types': [
        'retail', 'agriculture', 'manufacturing', 'services',
        'mining', 'tourism', 'technology', 'healthcare'
    ]
}

def get_supported_formats():
    """
    Get list of supported file formats
    
    Returns:
        dict: Supported formats with descriptions
    """
    return SUPPORTED_FORMATS.copy()

def is_format_supported(file_extension: str):
    """
    Check if a file format is supported
    
    Args:
        file_extension (str): File extension (e.g., '.csv')
    
    Returns:
        bool: True if supported, False otherwise
    """
    return file_extension.lower() in SUPPORTED_FORMATS

def get_ghana_context():
    """
    Get Ghana-specific data context
    
    Returns:
        dict: Ghana business context data
    """
    return GHANA_DATA_CONTEXT.copy()

# Data validation utilities
class DataValidationError(Exception):
    """Custom exception for data validation errors"""
    pass

class UnsupportedFormatError(Exception):
    """Custom exception for unsupported file formats"""
    pass

# Common column name mappings for Ghana businesses
COLUMN_MAPPINGS = {
    'date': ['date', 'time', 'timestamp', 'created_at', 'transaction_date'],
    'sales': ['sales', 'revenue', 'amount', 'total', 'value', 'turnover'],
    'product': ['product', 'item', 'sku', 'product_name', 'goods'],
    'region': ['region', 'location', 'area', 'zone', 'territory', 'district'],
    'customer': ['customer', 'client', 'buyer', 'patron', 'customer_type'],
    'quantity': ['quantity', 'qty', 'count', 'units', 'volume']
}

def get_column_mappings():
    """
    Get common column name mappings
    
    Returns:
        dict: Column mappings for common business data
    """
    return COLUMN_MAPPINGS.copy()