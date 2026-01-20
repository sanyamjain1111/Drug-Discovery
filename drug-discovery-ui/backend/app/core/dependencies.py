from fastapi import Depends, HTTPException, status
from .config import get_settings, Settings


def require_openai(settings: Settings = Depends(get_settings)) -> Settings:
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="OPENAI_API_KEY is not configured")
    return settings
