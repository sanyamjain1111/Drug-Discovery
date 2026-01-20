from typing import List, Literal, Optional
from pydantic import BaseModel, Field

Severity = Literal['mild', 'moderate', 'severe', 'contraindicated']
InteractionType = Literal['synergistic', 'antagonistic', 'additive', 'none']
OverallSafety = Literal['safe', 'caution', 'dangerous', 'contraindicated']

class InteractionPair(BaseModel):
    drugs: List[str] = Field(..., min_items=2)
    type: InteractionType
    severity: Severity
    mechanism: str
    clinicalSignificance: str
    recommendations: str

class InteractionRequest(BaseModel):
    drugs: List[str] = Field(..., min_items=2, max_items=5)

class InteractionResponse(BaseModel):
    overallSafety: OverallSafety
    interactions: List[InteractionPair]
    saferAlternatives: List[str] = []
    heuristic: bool = False
    error: Optional[str] = None
