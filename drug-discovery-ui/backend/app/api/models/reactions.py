from typing import List, Optional, Literal
from pydantic import BaseModel, Field

EnergyChange = Literal['exothermic', 'endothermic', 'neutral']

class ReactionConditions(BaseModel):
    temperature: Optional[str] = Field(None, description='e.g., 25 C')
    pressure: Optional[str] = Field(None, description='e.g., 1 atm')
    catalyst: Optional[str] = None
    solvent: Optional[str] = None

class ReactionRequest(BaseModel):
    reactantA: str = Field(..., min_length=1)
    reactantB: str = Field(..., min_length=1)
    conditions: ReactionConditions = ReactionConditions()

class ReactionProduct(BaseModel):
    name: str
    confidence: int = Field(ge=0, le=100)
    byproduct: bool = False

class ReactionResponse(BaseModel):
    equation: str
    products: List[ReactionProduct]
    mechanismSteps: List[str]
    yieldPercent: int = Field(ge=0, le=100)
    energyChange: EnergyChange = 'neutral'
    heuristic: bool = False
    error: Optional[str] = None
