# backend/test_app.py
import pytest
from app import app as flask_app # Import your Flask app instance

@pytest.fixture()
def app():
    yield flask_app

@pytest.fixture()
def client(app):
    return app.test_client()

def test_hello_world(client):
    """A simple test to ensure a non-existent route returns 404."""
    response = client.get("/")
    assert response.status_code == 404