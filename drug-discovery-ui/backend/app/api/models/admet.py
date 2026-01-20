from typing import Optional, Dict, Any
from pydantic import BaseModel


class AdmetRequest(BaseModel):
    molecule: str
    smiles: Optional[str] = None


class AdmetResponse(BaseModel):
    ok: bool
    absorption: Optional[Dict[str, Any]] = None
    distribution: Optional[Dict[str, Any]] = None
    metabolism: Optional[Dict[str, Any]] = None
    excretion: Optional[Dict[str, Any]] = None
    toxicity: Optional[Dict[str, Any]] = None
    overallAssessment: Optional[str] = None
    regulatoryOutlook: Optional[str] = None
    error: Optional[str] = None
