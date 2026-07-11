import pytest

def test_read_root(client):
    """
    Test the root endpoint of the API.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_health_check(async_client):
    """
    Test the health check endpoint.
    """
    # Assuming there's a health endpoint router or we can just test another simple async route.
    # We will test if the / endpoint responds with async client.
    response = await async_client.get("/")
    assert response.status_code == 200

def test_create_and_read_project(client):
    """
    Test creating and reading a project to verify database connection.
    """
    # Create a project
    create_response = client.post(
        "/api/v1/projects/",
        json={"title": "DB Test Project", "description": "Testing the DB connection"}
    )
    assert create_response.status_code == 200
    created_project = create_response.json()
    assert created_project["title"] == "DB Test Project"
    
    # Read projects
    read_response = client.get("/api/v1/projects/")
    assert read_response.status_code == 200
    projects = read_response.json()
    assert len(projects) > 0
    assert any(p["title"] == "DB Test Project" for p in projects)
