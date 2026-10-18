from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Backend API")


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse()
