from typing import List, Optional, Literal
from pydantic import BaseModel, Field

Strategy = Literal['genetic', 'transformer', 'rnn', 'graph-ml']

class DesiredProps(BaseModel):
    toxicityLow: bool = True
    solubilityHigh: bool = True
    bbbNo: bool = False
    ro5Yes: bool = True

class Constraints(BaseModel):
    mwMin: Optional[int] = None
    mwMax: Optional[int] = None
    groups: Optional[str] = None

class GeneratorRequest(BaseModel):
    target: str
    properties: DesiredProps
    constraints: Constraints = Constraints()
    count: int = Field(10, ge=1, le=200)
    strategy: Strategy = 'transformer'
    seedSmiles: Optional[str] = None

class CandidateProps(BaseModel):
    toxicity: Optional[dict] = None
    solubility: Optional[dict] = None
    drugLikeness: Optional[dict] = None
    bioavailability: Optional[dict] = None
    bbbPenetration: Optional[dict] = None
    lipinskiRules: Optional[dict] = None

class Candidate(BaseModel):
    smiles: str = ''
    rationale: Optional[str] = None
    valid: bool = True
    unique: bool = True
    synthesizable: bool = True
    filtered: bool = False
    score: float = 0.0
    properties: Optional[CandidateProps] = None

class GeneratorResponse(BaseModel):
    ok: bool
    total: int
    generated: List[Candidate]
    error: Optional[str] = None
