from pydantic import BaseModel, Field
from typing import List, Optional

class HealthResponse(BaseModel):
    status: str = "ok"
    message: str = "API is running"

class MoleculeRequest(BaseModel):
    molecule: str = Field(..., min_length=1, description="Molecule name")
    smiles: Optional[str] = Field(None, description="SMILES string")

class MoleculeResponse(BaseModel):
    success: bool
    analysis: str
    molecule: str

class ToxicityModel(BaseModel):
    score: int = Field(ge=0, le=100)
    level: str
    explanation: str

class SolubilityModel(BaseModel):
    score: int = Field(ge=0, le=100)
    details: str

class DrugLikenessModel(BaseModel):
    score: int = Field(ge=0, le=100)
    passes: bool

class BioavailabilityModel(BaseModel):
    percentage: int = Field(ge=0, le=100)
    explanation: str

class BBBModel(BaseModel):
    canCross: bool
    confidence: str

class LipinskiModel(BaseModel):
    passes: bool
    violations: List[str] = []

class PropertyPrediction(BaseModel):
    toxicity: ToxicityModel
    solubility: SolubilityModel
    drugLikeness: DrugLikenessModel
    bioavailability: BioavailabilityModel
    bbbPenetration: BBBModel
    lipinskiRules: LipinskiModel

class PropertyPredictionResponse(BaseModel):
    success: bool
    molecule: str
    smiles: Optional[str] = None
    predictions: PropertyPrediction | None = None
    error: Optional[str] = None
    heuristic: Optional[bool] = False

class ExplainRequest(BaseModel):
    molecule: str
    property: str
    context: Optional[str] = None

class ExplainResponse(BaseModel):
    success: bool
    text: str
