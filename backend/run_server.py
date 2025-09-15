#!/usr/bin/env python3
"""
Production server runner for AI Data Scientist API
"""
import uvicorn
import os
import sys
from config import Config

def run_server():
    """Run the FastAPI server with production settings"""
    
    # Add the current directory to Python path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    # Production configuration
    uvicorn_config = {
        "app": "api.main:app",
        "host": Config.API_HOST,
        "port": Config.API_PORT,
        "workers": int(os.getenv("WORKERS", 1)),
        "log_level": "info" if not Config.DEBUG else "debug",
        "access_log": True,
        "reload": Config.DEBUG,
    }
    
    # Add SSL if certificates are available
    ssl_keyfile = os.getenv("SSL_KEYFILE")
    ssl_certfile = os.getenv("SSL_CERTFILE")
    
    if ssl_keyfile and ssl_certfile:
        uvicorn_config.update({
            "ssl_keyfile": ssl_keyfile,
            "ssl_certfile": ssl_certfile
        })
    
    print(f"Starting AI Data Scientist API server on {Config.API_HOST}:{Config.API_PORT}")
    print(f"Debug mode: {Config.DEBUG}")
    print(f"Workers: {uvicorn_config['workers']}")
    
    uvicorn.run(**uvicorn_config)

if __name__ == "__main__":
    run_server()