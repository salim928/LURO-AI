import pytest
from fastapi.testclient import TestClient
from api.main import app
import tempfile
import csv
import io

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_csv():
    """Create a sample CSV file for testing"""
    csv_data = [
        ['date', 'product', 'sales', 'region'],
        ['2024-01-01', 'Widget A', '1500', 'Accra'],
        ['2024-01-02', 'Widget B', '2300', 'Kumasi'],
        ['2024-01-03', 'Widget A', '1800', 'Tamale'],
        ['2024-01-04', 'Widget C', '3200', 'Accra'],
        ['2024-01-05', 'Widget B', '2100', 'Kumasi']
    ]
    
    # Create temporary CSV file
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False, newline='')
    writer = csv.writer(temp_file)
    writer.writerows(csv_data)
    temp_file.close()
    
    return temp_file.name

def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "AI Data Scientist API is running! 🤖"

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_endpoint_success(client, sample_csv):
    """Test successful analysis"""
    with open(sample_csv, 'rb') as f:
        response = client.post(
            "/analyze",
            files={"file": ("test.csv", f, "text/csv")},
            data={"query": "Analyze sales performance"}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "results" in data
    assert len(data["results"]) > 50  # Ensure substantial response

def test_analyze_endpoint_no_file(client):
    """Test analysis without file"""
    response = client.post(
        "/analyze",
        data={"query": "Test query"}
    )
    
    assert response.status_code == 422  # Validation error

def test_analyze_endpoint_no_query(client, sample_csv):
    """Test analysis without query"""
    with open(sample_csv, 'rb') as f:
        response = client.post(
            "/analyze",
            files={"file": ("test.csv", f, "text/csv")}
        )
    
    assert response.status_code == 422  # Validation error

def test_sample_analysis_endpoint(client):
    """Test sample data analysis"""
    response = client.post(
        "/sample-analysis",
        data={"query": "Analyze Ghana business performance"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["is_sample"] is True
    assert "Ghana" in data["results"] or "ghana" in data["results"].lower()

def test_get_sample_data_endpoint(client):
    """Test get sample data endpoint"""
    response = client.get("/sample-data")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "columns" in data["data"]
    assert len(data["data"]["columns"]) > 0