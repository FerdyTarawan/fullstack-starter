from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

# apps/api/.env, regardless of the working directory the server is started from.
API_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=API_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    env: Literal["development", "production", "test"] = "development"
    api_title: str = "Backend API"
    cors_origins: list[str] = [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ]

    @property
    def docs_enabled(self) -> bool:
        """Serve interactive API docs and the OpenAPI schema outside production."""
        return self.env != "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
