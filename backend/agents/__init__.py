# backend/agents/__init__.py
"""
AI Agents Package
Contains all the specialized AI agents for data analysis
"""

from .main_agent import MainAgent
from .cleaning_agent import DataCleaner
from .stats_agent import StatsAnalyzer
from .report_agent import ReportGenerator
from .rag_retriever import RAGRetriever

# Export all agent classes
__all__ = [
    'MainAgent',
    'DataCleaner', 
    'StatsAnalyzer',
    'ReportGenerator',
    'RAGRetriever'
]

# Agent registry for dynamic loading
AGENT_REGISTRY = {
    'main': MainAgent,
    'cleaner': DataCleaner,
    'stats': StatsAnalyzer,
    'reporter': ReportGenerator,
    'rag': RAGRetriever
}

def get_agent(agent_name: str):
    """
    Get an agent instance by name
    
    Args:
        agent_name (str): Name of the agent ('main', 'cleaner', 'stats', 'reporter', 'rag')
    
    Returns:
        Agent instance or None if not found
    """
    agent_class = AGENT_REGISTRY.get(agent_name.lower())
    if agent_class:
        return agent_class()
    return None

def list_available_agents():
    """
    List all available agent names
    
    Returns:
        list: Available agent names
    """
    return list(AGENT_REGISTRY.keys())

# Agent capabilities metadata
AGENT_CAPABILITIES = {
    'main': {
        'description': 'Main orchestrator agent that coordinates all other agents',
        'capabilities': ['orchestration', 'workflow_management', 'result_compilation']
    },
    'cleaner': {
        'description': 'Data cleaning and preprocessing specialist',
        'capabilities': ['missing_value_handling', 'outlier_detection', 'data_standardization']
    },
    'stats': {
        'description': 'Statistical analysis and pattern detection expert',
        'capabilities': ['correlation_analysis', 'trend_detection', 'distribution_analysis']
    },
    'reporter': {
        'description': 'Business report generation and insight formatting',
        'capabilities': ['report_generation', 'insight_formatting', 'recommendation_creation']
    },
    'rag': {
        'description': 'Retrieval Augmented Generation for context-aware insights',
        'capabilities': ['context_retrieval', 'enhanced_insights', 'similarity_search']
    }
}

def get_agent_info(agent_name: str):
    """
    Get information about a specific agent
    
    Args:
        agent_name (str): Name of the agent
    
    Returns:
        dict: Agent information including description and capabilities
    """
    return AGENT_CAPABILITIES.get(agent_name.lower(), {})