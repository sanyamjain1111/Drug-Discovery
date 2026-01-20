from typing import Optional, Literal, List
from pydantic import BaseModel, Field

ProteinSource = Literal['pdb_text', 'pdb_id', 'url']

class DockingParams(BaseModel):
    exhaustiveness: int = Field(8, ge=1, le=64)
    numPoses: int = Field(10, ge=1, le=100)

class DockingRequest(BaseModel):
    proteinSource: ProteinSource = 'pdb_id'
    proteinData: Optional[str] = None  # raw PDB, ID, or URL depending on source
    ligand: str  # SMILES or name
    params: DockingParams = DockingParams()

class BindingSite(BaseModel):
    id: str
    residues: List[str] = []
    description: Optional[str] = None

class Interaction(BaseModel):
    type: str
    residues: List[str] = []
    description: Optional[str] = None
    distance: Optional[float] = None
    angle: Optional[float] = None

class Pose(BaseModel):
    id: str
    score: float
    bindingEnergy: Optional[float] = None
    interactions: List[Interaction] = []
    residues: List[str] = []

class DockingAnalysis(BaseModel):
    preparationSteps: List[str] = []
    sites: List[BindingSite] = []
    poseScore: Optional[float] = None
    bindingEnergy: Optional[float] = None
    interactions: List[Interaction] = []
    comparedBinders: List[str] = []
    affinity: Optional[float] = None  # predicted Kd (uM) or binding affinity surrogate
    ic50: Optional[float] = None
    ki: Optional[float] = None
    selectivityNotes: Optional[str] = None
    energyDecomposition: Optional[dict] = None
    confidence: Optional[str] = None
    poses: List[Pose] = []

class DockingResponse(BaseModel):
    ok: bool
    analysis: Optional[DockingAnalysis] = None
    error: Optional[str] = None
