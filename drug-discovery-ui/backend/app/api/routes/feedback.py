from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ...core.config import get_settings

router = APIRouter(prefix="/feedback")

class FeedbackRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    message: str

@router.post('/submit')
async def submit_feedback(req: FeedbackRequest):
    # For now, just log and return success. In production, persist to DB or send email.
    settings = get_settings()
    try:
        print(f"[Feedback] Received from {req.email or 'anonymous'}: {req.message}")
    except Exception:
        pass
    return {"ok": True, "message": "Thank you for your feedback."}
