from typing import List, Optional
from pydantic import BaseModel, Field

class StructureQuery(BaseModel):
    query: str = Field(..., description="Molecule identifier: name, SMILES, or InChIKey")
    format: Optional[str] = Field("json", description="json|sdf")

class StructureJSON(BaseModel):
    elements: List[str]
    positions: List[List[float]]  # [[x,y,z], ...]
    bonds: List[List[int]]  # [i,j,order]
    source: str = "pubchem"
    inchikey: Optional[str] = None

class StructureResponse(BaseModel):
    ok: bool
    format: str
    data: Optional[StructureJSON] = None
    sdf: Optional[str] = None
    error: Optional[str] = None
