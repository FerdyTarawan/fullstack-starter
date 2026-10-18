from fastapi.testclient import TestClient

from api.config import Settings
from api.main import app, create_app


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_is_documented():
    with TestClient(app) as client:
        schema = client.get("/openapi.json").json()
    assert "/api/health" in schema["paths"]


def test_cors_allows_configured_origin():
    custom_app = create_app(Settings(cors_origins=["http://127.0.0.1:3000"]))
    with TestClient(custom_app) as client:
        response = client.options(
            "/api/health",
            headers={
                "Origin": "http://127.0.0.1:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
    assert response.status_code == 200
    assert (
        response.headers.get("access-control-allow-origin") == "http://127.0.0.1:3000"
    )
