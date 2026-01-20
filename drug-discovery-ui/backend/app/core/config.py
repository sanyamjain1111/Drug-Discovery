from pydantic_settings import BaseSettings
from functools import lru_cache
import os
class Settings(BaseSettings):
    OPENAI_API_KEY: str | None = os.getenv("AZURE_OPENAI_KEY") or os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("AZURE_OPENAI_DEPLOYMENT") or "gpt-4o"
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT") or "https://azure1405.openai.azure.com"
    AZURE_OPENAI_API_VERSION: str = "2024-02-15-preview"
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache
def get_settings() -> Settings:
    return Settings()
