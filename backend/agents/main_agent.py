# Enhanced Agents System - New AI Agents

## Enhanced Main Agent (Orchestrator)

### `backend/agents/main_agent.py` - Enhanced Version

import pandas as pd
from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent, AgentInput, AgentResult, AgentPipeline
from .cleaning_agent import DataCleaner
from .hypothesis_agent import HypothesisAgent
from .preprocessing_agent import PreprocessingAgent
from .feature_agent import FeatureEngineeringAgent
from .stats_agent import StatsAnalyzer
from .model_agent import ModelTrainingAgent
from .report_agent import ReportGenerator
from .action_agent import CallToActionAgent
from ..core.state_manager import StateManager
import asyncio
from datetime import datetime
from dotenv import load_dotenv


load_dotenv()

class MainAgent(BaseAgent):
    """Enhanced orchestrator agent that manages the complete analysis pipeline"""
    
    def __init__(self, state_manager: StateManager):
        super().__init__("MainAgent")
        self.state_manager = state_manager
        
        # Initialize all sub-agents
        self.sub_agents = {
            'cleaner': DataCleaner(),
            'hypothesis': HypothesisAgent(),
            'preprocessing': PreprocessingAgent(),
            'feature_engineering': FeatureEngineeringAgent(),
            'stats': StatsAnalyzer(),
            'model_training': ModelTrainingAgent(),
            'reporter': ReportGenerator(),
            'action': CallToActionAgent()
        }
        
        # Define pipeline configurations for different query types
        self.pipeline_configs = {
            'exploratory': ['cleaner', 'stats', 'reporter', 'action'],
            'predictive': ['cleaner', 'hypothesis', 'preprocessing', 'feature_engineering', 'model_training', 'action'],
            'descriptive': ['cleaner', 'stats', 'reporter', 'action'],
            'comparative': ['cleaner', 'hypothesis', 'stats', 'reporter', 'action'],
            'forecasting': ['cleaner', 'preprocessing', 'feature_engineering', 'model_training', 'action']
        }
    
    def validate_input(self, input_data: AgentInput) -> bool:
        """Validate input for main agent"""
        if not hasattr(input_data, 'data') or input_data.data is None:
            return False
        
        if not isinstance(input_data.data, pd.DataFrame):
            return False
        
        if input_data.data.empty:
            return False
            
        return True
    
    async def process(self, input_data: AgentInput) -> AgentResult:
        """
        Main processing method that orchestrates the entire analysis pipeline
        """
        try:
            start_time = datetime.utcnow()
            analysis_id = input_data.analysis_id
            
            # Update state to processing
            if analysis_id:
                self.state_manager.set_processing_status(
                    analysis_id, 
                    self.name, 
                    5.0,
                    []
                )
            
            # Determine pipeline based on query intent
            query_intent = self._determine_query_intent(input_data.context.get('query', ''))
            pipeline_agents = self._get_pipeline_for_intent(query_intent)
            
            self.logger.info(f"Executing {query_intent} pipeline with agents: {pipeline_agents}")
            
            # Create and execute pipeline
            agents = [self.sub_agents[agent_name] for agent_name in pipeline_agents]
            pipeline = AgentPipeline(agents)
            
            # Execute pipeline with progress tracking
            results = await self._execute_with_progress_tracking(
                pipeline, input_data, analysis_id
            )
            
            # Compile final results
            final_result = self._compile_results(results, input_data, start_time)
            
            # Update state to completed
            if analysis_id:
                self.state_manager.set_completed_status(analysis_id, {
                    'key_insights': final_result.metadata.get('key_insights', []),
                    'recommendations': final_result.metadata.get('recommendations', []),
                    'visualizations': final_result.metadata.get('visualizations', [])
                })
            
            return final_result
            
        except Exception as e:
            # Update state to failed
            if input_data.analysis_id:
                self.state_manager.set_failed_status(
                    input_data.analysis_id, 
                    str(e),
                    {'agent': self.name, 'stage': 'orchestration'}
                )
            
            return self.handle_error(e, input_data)
    
    def _determine_query_intent(self, query: str) -> str:
        """Determine the type of analysis needed based on the query"""
        query_lower = query.lower()
        
        # Predictive keywords
        if any(keyword in query_lower for keyword in ['predict', 'forecast', 'future', 'will', 'likely']):
            return 'predictive'
        
        # Comparative keywords
        if any(keyword in query_lower for keyword in ['compare', 'vs', 'versus', 'difference', 'better', 'worse']):
            return 'comparative'
        
        # Forecasting keywords
        if any(keyword in query_lower for keyword in ['trend', 'projection', 'next month', 'next quarter']):
            return 'forecasting'
        
        # Exploratory keywords (default)
        return 'exploratory'
    
    def _get_pipeline_for_intent(self, intent: str) -> List[str]:
        """Get the appropriate agent pipeline for the query intent"""
        return self.pipeline_configs.get(intent, self.pipeline_configs['exploratory'])
    
    async def _execute_with_progress_tracking(
        self, 
        pipeline: AgentPipeline, 
        input_data: AgentInput,
        analysis_id: Optional[str]
    ) -> List[AgentResult]:
        """Execute pipeline with real-time progress updates"""
        results = []
        total_agents = len(pipeline.agents)
        completed_agents = []
        
        for i, agent in enumerate(pipeline.agents):
            try:
                # Update progress
                progress = ((i + 1) / total_agents) * 95  # Leave 5% for final compilation
                
                if analysis_id:
                    self.state_manager.set_processing_status(
                        analysis_id,
                        agent.name,
                        progress,
                        completed_agents.copy()
                    )
                
                self.logger.info(f"Executing agent {i+1}/{total_agents}: {agent.name}")
                
                # Validate input for this agent
                if not agent.validate_input(input_data):
                    error_result = AgentResult(
                        agent_name=agent.name,
                        success=False,
                        error_message=f"Input validation failed for {agent.name}"
                    )
                    results.append(error_result)
                    break
                
                # Execute agent
                result = agent.process(input_data)
                results.append(result)
                completed_agents.append(agent.name)
                
                # If agent failed, stop pipeline
                if not result.success:
                    self.logger.error(f"Agent {agent.name} failed, stopping pipeline")
                    break
                
                # Update input for next agent with previous results
                input_data.previous_results = results
                if result.data is not None:
                    input_data.data = result.data
                
                # Small delay to prevent overwhelming the system
                await asyncio.sleep(0.1)
                
            except Exception as e:
                error_result = agent.handle_error(e, input_data)
                results.append(error_result)
                break
        
        return results
    
    def _compile_results(
        self, 
        agent_results: List[AgentResult], 
        input_data: AgentInput,
        start_time: datetime
    ) -> AgentResult:
        """Compile results from all agents into final result"""
        
        # Check if pipeline was successful
        success = all(result.success for result in agent_results)
        
        # Gather insights from all agents
        key_insights = []
        recommendations = []
        visualizations = []
        technical_details = {}
        
        for result in agent_results:
            if result.success and result.metadata:
                # Extract insights
                if 'insights' in result.metadata:
                    key_insights.extend(result.metadata['insights'])
                
                if 'key_insights' in result.metadata:
                    key_insights.extend(result.metadata['key_insights'])
                
                # Extract recommendations
                if 'recommendations' in result.metadata:
                    recommendations.extend(result.metadata['recommendations'])
                
                # Extract visualizations
                if 'visualizations' in result.metadata:
                    visualizations.extend(result.metadata['visualizations'])
                
                # Store technical details
                technical_details[result.agent_name] = result.metadata
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(
            key_insights, recommendations, input_data.context.get('query', '')
        )
        
        # Calculate processing time
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Get final data (from last successful agent)
        final_data = None
        for result in reversed(agent_results):
            if result.success and result.data is not None:
                final_data = result.data
                break
        
        return AgentResult(
            agent_name=self.name,
            success=success,
            data=final_data,
            processing_time_seconds=processing_time,
            metadata={
                'executive_summary': executive_summary,
                'key_insights': key_insights,
                'recommendations': recommendations,
                'visualizations': visualizations,
                'technical_details': technical_details,
                'pipeline_results': [
                    {
                        'agent': r.agent_name,
                        'success': r.success,
                        'processing_time': r.processing_time_seconds,
                        'error': r.error_message if not r.success else None
                    } for r in agent_results
                ],
                'query': input_data.context.get('query', ''),
                'data_shape': final_data.shape if final_data is not None else None
            }
        )
    
    def _generate_executive_summary(
        self, 
        insights: List[str], 
        recommendations: List[str],
        query: str
    ) -> str:
        """Generate executive summary from all insights and recommendations"""
        
        summary_parts = []
        
        # Query context
        summary_parts.append(f"Analysis Query: {query}")
        
        # Key findings summary
        if insights:
            summary_parts.append("\nKEY FINDINGS:")
            # Take top 3 most important insights
            top_insights = insights[:3] if len(insights) >= 3 else insights
            for i, insight in enumerate(top_insights, 1):
                summary_parts.append(f"{i}. {insight}")
        
        # Recommendations summary
        if recommendations:
            summary_parts.append("\nTOP RECOMMENDATIONS:")
            # Take top 3 recommendations
            top_recommendations = recommendations[:3] if len(recommendations) >= 3 else recommendations
            for i, rec in enumerate(top_recommendations, 1):
                summary_parts.append(f"{i}. {rec}")
        
        return "\n".join(summary_parts)
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Enhanced capabilities information"""
        return {
            'name': self.name,
            'id': self.id,
            'type': 'orchestrator',
            'capabilities': [
                'pipeline_orchestration',
                'multi_agent_coordination',
                'progress_tracking',
                'result_compilation',
                'intent_detection'
            ],
            'supported_intents': list(self.pipeline_configs.keys()),
            'sub_agents': list(self.sub_agents.keys()),
            'input_requirements': ['pandas.DataFrame', 'query_context'],
            'output_format': 'comprehensive_analysis_result'
        }


