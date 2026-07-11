import pytest
from app.models.user import User
from app.models.project import Project

def test_user_model_creation():
    user = User(email="test@example.com", hashed_password="fake", full_name="Test")
    assert user.email == "test@example.com"
    assert user.full_name == "Test"

def test_project_creation():
    project = Project(title="AI Research", description="Test project", owner_id=1)
    assert project.title == "AI Research"
    assert project.description == "Test project"
    assert project.owner_id == 1
