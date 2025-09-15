"""
Tests Package
Unit tests and integration tests for the AI Data Scientist backend
"""

import sys
import os
from pathlib import Path

# Add the backend directory to the Python path for testing
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Test configuration
TEST_CONFIG = {
    'test_data_dir': backend_dir / 'tests' / 'test_data',
    'sample_csv': 'sample_ghana_business.csv',
    'api_base_url': 'http://localhost:8000',
    'timeout': 30
}

# Test utilities
def get_test_config():
    """
    Get test configuration
    
    Returns:
        dict: Test configuration settings
    """
    return TEST_CONFIG.copy()

def setup_test_environment():
    """
    Set up the test environment
    """
    # Create test data directory if it doesn't exist
    test_data_dir = TEST_CONFIG['test_data_dir']
    test_data_dir.mkdir(exist_ok=True)
    
    # Set environment variables for testing
    os.environ['TESTING'] = '1'
    os.environ['HUGGINGFACEHUB_API_TOKEN'] = 'test_token'

def cleanup_test_environment():
    """
    Clean up after tests
    """
    # Remove test environment variables
    if 'TESTING' in os.environ:
        del os.environ['TESTING']

# Test data generators
def create_sample_csv_data():
    """
    Create sample CSV data for testing
    
    Returns:
        list: Sample data rows
    """
    return [
        ['date', 'product', 'sales', 'region', 'customer_type'],
        ['2024-01-01', 'Kente Fabric', '2500', 'Greater Accra', 'Tourist'],
        ['2024-01-02', 'Palm Oil', '1800', 'Ashanti', 'Local'],
        ['2024-01-03', 'Shea Butter', '3200', 'Northern', 'Export'],
        ['2024-01-04', 'Cocoa Products', '4500', 'Western', 'Export'],
        ['2024-01-05', 'Textiles', '2100', 'Volta', 'Local']
    ]

def create_test_dataframe():
    """
    Create a test pandas DataFrame
    
    Returns:
        pd.DataFrame: Test DataFrame
    """
    import pandas as pd
    data = create_sample_csv_data()
    headers = data[0]
    rows = data[1:]
    
    df = pd.DataFrame(rows, columns=headers)
    df['sales'] = pd.to_numeric(df['sales'])
    df['date'] = pd.to_datetime(df['date'])
    
    return df

# Test fixtures
SAMPLE_QUERIES = [
    "Analyze sales performance across regions",
    "What are the top performing products?",
    "Identify seasonal trends in the data",
    "Recommend growth strategies for Ghana market"
]

def get_sample_queries():
    """
    Get sample queries for testing
    
    Returns:
        list: Sample analysis queries
    """
    return SAMPLE_QUERIES.copy()

# Test assertions
def assert_analysis_result_valid(result):
    """
    Assert that an analysis result is valid
    
    Args:
        result (dict): Analysis result to validate
    
    Raises:
        AssertionError: If result is not valid
    """
    assert isinstance(result, dict), "Result must be a dictionary"
    assert 'success' in result, "Result must have 'success' field"
    assert 'report' in result, "Result must have 'report' field"
    
    if result['success']:
        assert isinstance(result['report'], str), "Report must be a string"
        assert len(result['report']) > 0, "Report must not be empty"
    else:
        assert 'error' in result, "Failed result must have 'error' field"

# Export test utilities
__all__ = [
    'get_test_config',
    'setup_test_environment',
    'cleanup_test_environment',
    'create_sample_csv_data',
    'create_test_dataframe',
    'get_sample_queries',
    'assert_analysis_result_valid'
]