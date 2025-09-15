import redis
import json
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import uuid
from enum import Enum

class AnalysisStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

@dataclass
class AnalysisState:
    """Complete state of an analysis session"""
    analysis_id: str
    user_id: str
    organization_id: str
    status: AnalysisStatus
    created_at: datetime
    updated_at: datetime
    
    # Query context
    original_query: str
    intent: Optional[str] = None
    data_sources: Optional[List[str]] = None
    time_range: Optional[Dict[str, str]] = None
    
    # Processing state
    current_agent: Optional[str] = None
    completed_agents: List[str] = None
    progress_percentage: float = 0.0
    estimated_completion: Optional[datetime] = None
    
    # Data artifacts
    original_dataset_path: Optional[str] = None
    cleaned_dataset_path: Optional[str] = None
    feature_dataset_path: Optional[str] = None
    model_artifacts_path: Optional[str] = None
    
    # Results
    validated_hypotheses: List[str] = None
    key_insights: List[str] = None
    recommendations: List[str] = None
    visualizations: List[Dict[str, Any]] = None
    
    # Error tracking
    error_message: Optional[str] = None
    error_details: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.completed_agents is None:
            self.completed_agents = []
        if self.validated_hypotheses is None:
            self.validated_hypotheses = []
        if self.key_insights is None:
            self.key_insights = []
        if self.recommendations is None:
            self.recommendations = []
        if self.visualizations is None:
            self.visualizations = []

class StateManager:
    """Redis-based state management for analyses"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379/0"):
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.key_prefix = "ai_data_scientist"
        
    def _get_key(self, key_type: str, identifier: str) -> str:
        """Generate Redis key with consistent naming"""
        return f"{self.key_prefix}:{key_type}:{identifier}"
    
    def create_analysis(
        self, 
        user_id: str, 
        organization_id: str, 
        query: str,
        data_sources: Optional[List[str]] = None
    ) -> str:
        """
        Create a new analysis session
        
        Args:
            user_id: ID of the user initiating analysis
            organization_id: Organization ID
            query: Natural language query
            data_sources: List of data source identifiers
            
        Returns:
            str: Analysis ID
        """
        analysis_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        state = AnalysisState(
            analysis_id=analysis_id,
            user_id=user_id,
            organization_id=organization_id,
            status=AnalysisStatus.PENDING,
            created_at=now,
            updated_at=now,
            original_query=query,
            data_sources=data_sources or []
        )
        
        # Store in Redis
        key = self._get_key("analysis", analysis_id)
        self.redis_client.setex(
            key, 
            timedelta(hours=24),  # 24 hour expiration
            json.dumps(asdict(state), default=str)
        )
        
        # Add to user's analysis list
        user_key = self._get_key("user_analyses", user_id)
        self.redis_client.lpush(user_key, analysis_id)
        self.redis_client.expire(user_key, timedelta(days=30))
        
        return analysis_id
    
    def get_analysis(self, analysis_id: str) -> Optional[AnalysisState]:
        """
        Retrieve analysis state
        
        Args:
            analysis_id: Analysis identifier
            
        Returns:
            AnalysisState or None if not found
        """
        key = self._get_key("analysis", analysis_id)
        data = self.redis_client.get(key)
        
        if not data:
            return None
        
        state_dict = json.loads(data)
        
        # Convert datetime strings back to datetime objects
        state_dict['created_at'] = datetime.fromisoformat(state_dict['created_at'])
        state_dict['updated_at'] = datetime.fromisoformat(state_dict['updated_at'])
        if state_dict.get('estimated_completion'):
            state_dict['estimated_completion'] = datetime.fromisoformat(state_dict['estimated_completion'])
        
        # Convert status string to enum
        state_dict['status'] = AnalysisStatus(state_dict['status'])
        
        return AnalysisState(**state_dict)
    
    def update_analysis(self, analysis_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update analysis state
        
        Args:
            analysis_id: Analysis identifier
            updates: Dictionary of fields to update
            
        Returns:
            bool: True if successful
        """
        current_state = self.get_analysis(analysis_id)
        if not current_state:
            return False
        
        # Update timestamp
        updates['updated_at'] = datetime.utcnow()
        
        # Update state object
        for key, value in updates.items():
            if hasattr(current_state, key):
                setattr(current_state, key, value)
        
        # Save back to Redis
        key = self._get_key("analysis", analysis_id)
        self.redis_client.setex(
            key,
            timedelta(hours=24),
            json.dumps(asdict(current_state), default=str)
        )
        
        return True
    
    def set_processing_status(
        self, 
        analysis_id: str, 
        current_agent: str, 
        progress: float,
        completed_agents: List[str] = None
    ) -> bool:
        """
        Update processing status
        
        Args:
            analysis_id: Analysis identifier
            current_agent: Currently executing agent
            progress: Progress percentage (0-100)
            completed_agents: List of completed agent names
            
        Returns:
            bool: True if successful
        """
        updates = {
            'status': AnalysisStatus.PROCESSING,
            'current_agent': current_agent,
            'progress_percentage': progress
        }
        
        if completed_agents:
            updates['completed_agents'] = completed_agents
        
        return self.update_analysis(analysis_id, updates)
    
    def set_completed_status(
        self, 
        analysis_id: str, 
        results: Dict[str, Any]
    ) -> bool:
        """
        Mark analysis as completed with results
        
        Args:
            analysis_id: Analysis identifier
            results: Analysis results
            
        Returns:
            bool: True if successful
        """
        updates = {
            'status': AnalysisStatus.COMPLETED,
            'progress_percentage': 100.0,
            'current_agent': None,
            **results
        }
        
        return self.update_analysis(analysis_id, updates)
    
    def set_failed_status(
        self, 
        analysis_id: str, 
        error_message: str,
        error_details: Dict[str, Any] = None
    ) -> bool:
        """
        Mark analysis as failed
        
        Args:
            analysis_id: Analysis identifier
            error_message: Error description
            error_details: Additional error information
            
        Returns:
            bool: True if successful
        """
        updates = {
            'status': AnalysisStatus.FAILED,
            'error_message': error_message,
            'error_details': error_details or {},
            'current_agent': None
        }
        
        return self.update_analysis(analysis_id, updates)
    
    def get_user_analyses(
        self, 
        user_id: str, 
        limit: int = 50
    ) -> List[AnalysisState]:
        """
        Get user's analysis history
        
        Args:
            user_id: User identifier
            limit: Maximum number of analyses to return
            
        Returns:
            List of AnalysisState objects
        """
        user_key = self._get_key("user_analyses", user_id)
        analysis_ids = self.redis_client.lrange(user_key, 0, limit - 1)
        
        analyses = []
        for analysis_id in analysis_ids:
            state = self.get_analysis(analysis_id)
            if state:
                analyses.append(state)
        
        return analyses
    
    def cancel_analysis(self, analysis_id: str) -> bool:
        """
        Cancel a running analysis
        
        Args:
            analysis_id: Analysis identifier
            
        Returns:
            bool: True if successful
        """
        return self.update_analysis(analysis_id, {
            'status': AnalysisStatus.CANCELLED,
            'current_agent': None
        })
    
    def cleanup_expired_analyses(self):
        """Clean up expired analysis data"""
        # This would typically be run by a background job
        # Redis TTL handles most cleanup automatically
        pass
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Get system-wide processing statistics"""
        # This would scan for analyses in different states
        # and return aggregate statistics
        return {
            'total_analyses': 0,
            'processing_count': 0,
            'completed_today': 0,
            'failed_today': 0,
            'average_processing_time': 0
        }