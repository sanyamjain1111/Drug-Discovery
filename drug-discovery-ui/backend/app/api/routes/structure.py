from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Any
from ..models.structure import StructureResponse
from ...services.structure_service import StructureService
from ...services.openai_service import OpenAIService
from ...utils.molecule_utils import cache, cache_key_molecule
import json

router = APIRouter(prefix="/structure")

class StructureGenerationRequest(BaseModel):
    moleculeName: str
    context: Optional[str] = None
    preferSMILES: bool = True

class StructureGenerationResponse(BaseModel):
    success: bool
    moleculeName: str
    smiles: Optional[str] = None
    iupacName: Optional[str] = None
    molecularFormula: Optional[str] = None
    description: Optional[str] = None
    source: str = "ai"
    confidence: Optional[float] = None
    error: Optional[str] = None

@router.get("")
async def get_structure(query: str = Query(..., description="Name/SMILES/InChIKey"), format: str = Query("json")) -> StructureResponse:
    key = cache_key_molecule(f"structure:{format}:{query.strip().lower()}")
    cached = cache.get(key)
    if cached:
        return cached

    svc = StructureService()
    sdf = await svc.fetch_pubchem_sdf(query)
    if not sdf:
        return StructureResponse(ok=False, format=format, error="Not found")

    if format == "sdf":
        resp = StructureResponse(ok=True, format="sdf", sdf=sdf)
        cache.set(key, resp.model_dump())
        return resp

    js = svc.sdf_to_json(sdf)
    if not js:
        return StructureResponse(ok=False, format="json", error="Failed to parse SDF")
    resp = StructureResponse(ok=True, format="json", data=js)  # type: ignore
    cache.set(key, resp.model_dump())
    return resp

@router.post("/generate-ai", response_model=StructureGenerationResponse)
async def generate_structure_ai(req: StructureGenerationRequest) -> StructureGenerationResponse:
    """
    Generate molecular structure using AI when direct database lookup fails.
    Uses OpenAI to infer SMILES, IUPAC name, and molecular formula.
    """
    try:
        # Check cache first
        cache_key = cache_key_molecule(f"ai_structure:{req.moleculeName.lower()}")
        cached = cache.get(cache_key)
        if cached:
            return StructureGenerationResponse(**cached)
        
        # Call OpenAI to generate structure
        openai = OpenAIService()
        system_prompt = (
            "You are a chemistry expert. Generate realistic molecular structures. "
            "Return ONLY valid JSON, no markdown or extra text."
        )
        user_prompt = (
            f"Generate a valid chemical structure for: {req.moleculeName}\n"
            "Return JSON with: {\"smiles\": \"...\", \"iupacName\": \"...\", \"molecularFormula\": \"...\", \"description\": \"...\"}"
        )
        
        response = await openai._chat(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        content = openai._extract_content(response)
        cleaned_json = openai._extract_json(content)
        parsed = json.loads(cleaned_json)
        
        result = StructureGenerationResponse(
            success=True,
            moleculeName=req.moleculeName,
            smiles=parsed.get("smiles"),
            iupacName=parsed.get("iupacName"),
            molecularFormula=parsed.get("molecularFormula"),
            description=parsed.get("description"),
            source="ai",
            confidence=0.85  # AI-generated structures have moderate confidence
        )
        
        # Cache the result
        cache.set(cache_key, result.model_dump(), ttl=3600)  # 1 hour TTL
        return result
        
    except Exception as e:
        return StructureGenerationResponse(
            success=False,
            moleculeName=req.moleculeName,
            source="ai",
            error=f"AI generation failed: {str(e)}"
        )
