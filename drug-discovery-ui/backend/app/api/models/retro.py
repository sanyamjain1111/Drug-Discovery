from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RetroConstraints(BaseModel):
    time: Optional[str] = Field(None, description="fast|standard|extended")
    cost: Optional[str] = Field(None, description="low|medium|high")
    safety: Optional[str] = Field(None, description="standard|cautious|stringent")


class RetroRequest(BaseModel):
    target: str
    constraints: RetroConstraints = RetroConstraints()
    starting: Optional[List[str]] = None
    routes: int = Field(3, ge=1, le=5)


class RetroStep(BaseModel):
    id: str
    label: str
    yieldPct: Optional[float] = None
    reagents: Optional[str] = None
    conditions: Optional[str] = None


class RetroRoute(BaseModel):
    id: str
    steps: List[RetroStep]
    overallYield: Optional[float] = None
    cost: Optional[str] = None
    time: Optional[str] = None
    safety: Optional[str] = None
    difficulty: Optional[str] = None
    hazards: Optional[List[str]] = None
    greenScore: Optional[float] = None
    references: Optional[List[str]] = None


class RetroMeta(BaseModel):
    rankings: Dict[str, List[str]] = {}
    criticalSteps: Dict[str, List[str]] = {}
    alternatives: Dict[str, List[str]] = {}


class RetroResponse(BaseModel):
    ok: bool
    routes: List[RetroRoute] = []
    meta: Optional[RetroMeta] = None
    error: Optional[str] = None
