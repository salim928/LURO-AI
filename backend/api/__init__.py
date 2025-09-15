# backend/api/__init__.py
"""
API Package
FastAPI application and route handlers
"""

from .main import app

# Export the FastAPI app
__all__ = ['app']

# API metadata
API_INFO = {
    'title': 'AI Data Scientist API',
    'description': 'AI-powered business intelligence for Ghana SMEs',
    'version': '1.0.0',
    'contact': {
        'name': 'AI Data Scientist Support',
        'email': 'support@aidatascientist.gh'
    },
    'license': {
        'name': 'MIT',
        'url': 'https://opensource.org/licenses/MIT'
    }
}

# API endpoints registry
ENDPOINTS = {
    'health': {
        'path': '/health',
        'method': 'GET',
        'description': 'Health check endpoint'
    },
    'analyze': {
        'path': '/analyze',
        'method': 'POST', 
        'description': 'Analyze uploaded CSV data'
    },
    'sample_analysis': {
        'path': '/sample-analysis',
        'method': 'POST',
        'description': 'Analyze sample data for demonstration'
    },
    'sample_data': {
        'path': '/sample-data',
        'method': 'GET',
        'description': 'Get sample data for frontend display'
    }
}

def get_api_info():
    """
    Get API information
    
    Returns:
        dict: API metadata
    """
    return API_INFO.copy()

def get_endpoints():
    """
    Get available API endpoints
    
    Returns:
        dict: Available endpoints with metadata
    """
    return ENDPOINTS.copy()

# Rate limiting configuration
RATE_LIMITS = {
    'analyze': '5 per minute',
    'sample_analysis': '10 per minute',
    'health': '60 per minute'
}

def get_rate_limits():
    """
    Get API rate limits
    
    Returns:
        dict: Rate limits per endpoint
    """
    return RATE_LIMITS.copy()