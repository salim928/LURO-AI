from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime
import uuid
import logging

@dataclass
class AgentResult:
    """Standardized result format for all agents"""
    agent_name: str
    success: bool
    data: Optional[Any] = None
    metadata: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    processing_time_seconds: Optional[float] = None
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()

@dataclass
class AgentInput:
    """Standardized input format for all agents"""
    data: Any
    context: Dict[str, Any]
    user_id: Optional[str] = None
    analysis_id: Optional[str] = None
    previous_results: Optional[List[AgentResult]] = None

class BaseAgent(ABC):
    """Base class for all agents in the system"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(f"agents.{name}")
        self.id = str(uuid.uuid4())
        
    @abstractmethod
    def process(self, input_data: AgentInput) -> AgentResult:
        """
        Main processing method that each agent must implement
        
        Args:
            input_data: Standardized input containing data and context
            
        Returns:
            AgentResult: Standardized result format
        """
        pass
    
    @abstractmethod
    def validate_input(self, input_data: AgentInput) -> bool:
        """
        Validate that the input data is suitable for this agent
        
        Args:
            input_data: Input to validate
            
        Returns:
            bool: True if input is valid
        """
        pass
    
    def get_capabilities(self) -> Dict[str, Any]:
        """
        Return information about what this agent can do
        
        Returns:
            Dict containing capabilities, requirements, etc.
        """
        return {
            'name': self.name,
            'id': self.id,
            'capabilities': [],
            'input_requirements': [],
            'output_format': 'AgentResult'
        }
    
    def log_processing_start(self, input_data: AgentInput):
        """Log the start of processing"""
        self.logger.info(f"Starting processing for analysis {input_data.analysis_id}")
    
    def log_processing_end(self, result: AgentResult):
        """Log the end of processing"""
        status = "SUCCESS" if result.success else "FAILED"
        self.logger.info(f"Processing completed: {status}")
        
    def handle_error(self, error: Exception, input_data: AgentInput) -> AgentResult:
        """
        Standard error handling for all agents
        
        Args:
            error: The exception that occurred
            input_data: The input that caused the error
            
        Returns:
            AgentResult with error information
        """
        error_message = f"{self.name} failed: {str(error)}"
        self.logger.error(error_message, exc_info=True)
        
        return AgentResult(
            agent_name=self.name,
            success=False,
            error_message=error_message,
            metadata={'input_analysis_id': input_data.analysis_id}
        )

class AgentPipeline:
    """Manages execution of multiple agents in sequence"""
    
    def __init__(self, agents: List[BaseAgent]):
        self.agents = agents
        self.logger = logging.getLogger("agents.pipeline")
        
    async def execute(self, input_data: AgentInput) -> List[AgentResult]:
        """
        Execute all agents in the pipeline
        
        Args:
            input_data: Initial input data
            
        Returns:
            List of results from each agent
        """
        results = []
        current_input = input_data
        
        for agent in self.agents:
            try:
                self.logger.info(f"Executing agent: {agent.name}")
                
                # Validate input
                if not agent.validate_input(current_input):
                    result = AgentResult(
                        agent_name=agent.name,
                        success=False,
                        error_message=f"Input validation failed for {agent.name}"
                    )
                    results.append(result)
                    break
                
                # Execute agent
                result = agent.process(current_input)
                results.append(result)
                
                # If agent failed, stop pipeline
                if not result.success:
                    self.logger.error(f"Agent {agent.name} failed, stopping pipeline")
                    break
                
                # Update input for next agent with previous results
                current_input.previous_results = results
                if result.data is not None:
                    current_input.data = result.data
                    
            except Exception as e:
                error_result = agent.handle_error(e, current_input)
                results.append(error_result)
                break
        
        return results
    
    def get_pipeline_info(self) -> Dict[str, Any]:
        """Get information about the pipeline"""
        return {
            'agent_count': len(self.agents),
            'agents': [agent.get_capabilities() for agent in self.agents],
            'execution_order': [agent.name for agent in self.agents]
        }