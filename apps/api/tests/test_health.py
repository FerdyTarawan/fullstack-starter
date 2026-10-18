from fastapi.testclient import TestClient

from shorten_it_api.main import app


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_is_documented():
    with TestClient(app) as client:
        schema = client.get("/openapi.json").json()
    assert "/api/health" in schema["paths"]
