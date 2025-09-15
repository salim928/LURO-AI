import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # AI Model Configuration
    HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "google/flan-t5-large")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    
    # File Upload Limits
    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 50 * 1024 * 1024))  # 50MB
    ALLOWED_EXTENSIONS = os.getenv("ALLOWED_EXTENSIONS", "csv").split(",")
    
    # Analysis Configuration
    MAX_ANALYSIS_TIME = int(os.getenv("MAX_ANALYSIS_TIME", 120))  # seconds
    DEFAULT_TOP_K = int(os.getenv("DEFAULT_TOP_K", 3))  # RAG retrieval
    
    # Business Configuration
    SUPPORTED_CURRENCIES = ["GHS", "GH₵", "USD", "EUR"]
    GHANA_REGIONS = [
        "Greater Accra", "Ashanti", "Northern", "Western", "Eastern",
        "Volta", "Upper East", "Upper West", "Central", "Brong-Ahafo"
    ]
    
    @classmethod
    def validate_config(cls):
        """Validate configuration settings"""
        errors = []
        
        if not cls.HUGGINGFACE_API_TOKEN:
            errors.append("HUGGINGFACEHUB_API_TOKEN is required")
        
        if cls.MAX_FILE_SIZE < 1024:  # Less than 1KB
            errors.append("MAX_FILE_SIZE is too small")
        
        if errors:
            raise ValueError(f"Configuration errors: {', '.join(errors)}")
        
        return True

# Validate configuration on import
try:
    Config.validate_config()
except ValueError as e:
    print(f"Configuration Warning: {e}")