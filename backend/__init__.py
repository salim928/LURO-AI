"""
AI Data Scientist Backend Package
A comprehensive AI-powered data analysis platform for Ghanaian SMEs
"""

__version__ = "1.0.0"
__author__ = "AI Data Scientist Team"
__description__ = "AI-powered business intelligence for Ghana SMEs"

# Package metadata
__all__ = [
    "agents",
    "data", 
    "api",
    "utils",
    "config"
]

# Version info
VERSION_INFO = {
    "major": 1,
    "minor": 0,
    "patch": 0,
    "release": "stable"
}

def get_version():
    """Get the current version string"""
    return f"{VERSION_INFO['major']}.{VERSION_INFO['minor']}.{VERSION_INFO['patch']}"

def get_full_version():
    """Get the full version string with release info"""
    base_version = get_version()
    if VERSION_INFO['release'] != 'stable':
        return f"{base_version}-{VERSION_INFO['release']}"
    return base_version