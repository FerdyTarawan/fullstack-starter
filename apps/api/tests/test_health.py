from fastapi.testclient import TestClient

from api.config import Settings
from api.main import app, create_app


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_is_documented():
    with TestClient(create_app(Settings(env="development"))) as client:
        schema = client.get("/openapi.json").json()
    assert "/api/health" in schema["paths"]
    assert "/docs" not in schema["paths"]


def test_api_docs_endpoints():
    with TestClient(create_app(Settings(env="development"))) as client:
        scalar_response = client.get("/docs")
        swagger_response = client.get("/swagger")
    assert scalar_response.status_code == 200
    assert "scalar" in scalar_response.text.lower()
    assert swagger_response.status_code == 200
    assert "swagger-ui" in swagger_response.text.lower()


def test_api_docs_hidden_in_production():
    production_app = create_app(Settings(env="production"))
    with TestClient(production_app) as client:
        for path in ("/docs", "/swagger", "/redoc", "/openapi.json"):
            assert client.get(path).status_code == 404, path
        assert client.get("/api/health").status_code == 200
    # The schema stays available in-process for `mise run gen:api`.
    assert "/api/health" in production_app.openapi()["paths"]


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
