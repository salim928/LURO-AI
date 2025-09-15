import pytest
import pandas as pd
import numpy as np
from agents.main_agent import MainAgent

class TestMainAgent:
    
    @pytest.fixture
    def main_agent(self):
        return MainAgent()
    
    @pytest.fixture
    def sample_data(self):
        """Create sample data for testing"""
        np.random.seed(42)
        data = {
            'date': pd.date_range('2024-01-01', periods=100),
            'product': np.random.choice(['A', 'B', 'C'], 100),
            'region': np.random.choice(['Accra', 'Kumasi', 'Tamale'], 100),
            'sales': np.random.normal(1000, 200, 100),
            'quantity': np.random.randint(1, 100, 100)
        }
        return pd.DataFrame(data)
    
    def test_analyze_data_success(self, main_agent, sample_data):
        """Test successful data analysis"""
        result = main_agent.analyze_data(
            df=sample_data,
            query="Analyze sales performance"
        )
        
        assert result["success"] is True
        assert "report" in result
        assert "data_summary" in result
        assert len(result["report"]) > 100  # Ensure substantial report
    
    def test_analyze_data_empty_dataframe(self, main_agent):
        """Test analysis with empty dataframe"""
        empty_df = pd.DataFrame()
        result = main_agent.analyze_data(
            df=empty_df,
            query="Test query"
        )
        
        assert result["success"] is False
        assert "error" in result
    
    def test_analyze_data_no_numeric_columns(self, main_agent):
        """Test analysis with no numeric columns"""
        text_df = pd.DataFrame({
            'name': ['A', 'B', 'C'],
            'category': ['X', 'Y', 'Z']
        })
        
        result = main_agent.analyze_data(
            df=text_df,
            query="Analyze performance"
        )
        
        # Should still work but with limited insights
        assert result["success"] is True