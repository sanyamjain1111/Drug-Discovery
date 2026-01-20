from fastapi import APIRouter, Depends, HTTPException, status
from ...api.models.schemas import (
    MoleculeRequest,
    MoleculeResponse,
    PropertyPredictionResponse,
    PropertyPrediction,
    ExplainRequest,
    ExplainResponse,
)
from ...core.config import get_settings, Settings
from ...core.dependencies import require_openai
from ...services.openai_service import OpenAIService
from ...utils.molecule_utils import cache, cache_key_molecule, rate_limiter
from ...utils.chemo_utils import (
    is_valid_smiles,
    comprehensive_validation,
    normalize_smiles,
    get_molecular_weight,
    calculate_lipinski_properties,
)

router = APIRouter(prefix="/molecule")

@router.post("/test-analysis", response_model=MoleculeResponse)
async def test_analysis(
    payload: MoleculeRequest,
    settings: Settings = Depends(require_openai),
):
    name = payload.molecule.strip()
    smiles = (payload.smiles or '').strip() or None
    
    if not rate_limiter.allow("global"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")

    # Validate SMILES if provided
    if smiles and not is_valid_smiles(smiles):
        raise HTTPException(status_code=400, detail=f"Invalid SMILES: {smiles}")

    key = cache_key_molecule(name)
    cached = cache.get(key)
    if cached:
        return MoleculeResponse(success=True, analysis=cached, molecule=name)

    svc = OpenAIService(model=settings.OPENAI_MODEL)
    try:
        analysis = await svc.analyze_molecule(name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {e}")

    cache.set(key, analysis)
    return MoleculeResponse(success=True, analysis=analysis, molecule=name)

# Compatibility endpoint for current frontend (/api/chat)
@router.post("/compat-chat")
async def compat_chat(payload: MoleculeRequest, settings: Settings = Depends(require_openai)):
    # mirror shape used by front-end chatAboutMolecule
    name = payload.molecule.strip()
    svc = OpenAIService(model=settings.OPENAI_MODEL)
    try:
        analysis = await svc.analyze_molecule(name)
        return {"ok": True, "model": settings.OPENAI_MODEL, "content": analysis}
    except Exception as e:
        return {"ok": False, "error": "OpenAI API error", "details": str(e)}


@router.post("/validate-structure")
async def validate_structure(payload: MoleculeRequest):
    """
    Comprehensive SMILES structure validation using RDKit.
    Returns detailed validation report including molecular properties.
    """
    smiles = (payload.smiles or '').strip()
    if not smiles:
        raise HTTPException(status_code=400, detail="SMILES is required for structure validation")
    
    validation_report = comprehensive_validation(smiles)
    
    return {
        "smiles": smiles,
        "canonical_smiles": validation_report.get('canonical_smiles'),
        "valid": validation_report.get('valid'),
        "error": validation_report.get('error'),
        "properties": {
            "molecular_formula": validation_report.get('molecular_formula'),
            "molecular_weight": validation_report.get('molecular_weight'),
            "tpsa": validation_report.get('tpsa'),
            "lipinski": validation_report.get('lipinski_properties'),
        },
        "safety": {
            "toxicophores": validation_report.get('toxicophores'),
            "pains_match": validation_report.get('pains_match'),
            "structural_alerts": validation_report.get('structural_alerts'),
        },
        "synthesizability": {
            "likely": validation_report.get('synthesizable'),
            "reason": validation_report.get('synthesizable_reason'),
        },
    }


@router.post("/predict-properties", response_model=PropertyPredictionResponse)
async def predict_properties(
    payload: MoleculeRequest,
    settings: Settings = Depends(require_openai),
):
    name = payload.molecule.strip()
    smiles = (payload.smiles or '').strip() or None
    
    if not rate_limiter.allow("predict-properties"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")

    # Validate SMILES if provided
    if smiles and not is_valid_smiles(smiles):
        raise HTTPException(status_code=400, detail=f"Invalid SMILES: {smiles}")

    key = cache_key_molecule(f"props:{name}:{smiles or ''}")
    cached = cache.get(key)
    if cached:
        return PropertyPredictionResponse(success=True, molecule=name, smiles=smiles, predictions=cached)

    svc = OpenAIService(model=settings.OPENAI_MODEL)
    try:
        raw = await svc.predict_properties(name, smiles)
        if not raw:
            # Heuristic fallback: minimal estimate flagged as heuristic
            heuristic = {
                "toxicity": {"score": 30, "level": "medium", "explanation": "Heuristic placeholder: model unavailable."},
                "solubility": {"score": 50, "details": "Heuristic placeholder."},
                "drugLikeness": {"score": 50, "passes": True},
                "bioavailability": {"percentage": 50, "explanation": "Heuristic placeholder."},
                "bbbPenetration": {"canCross": False, "confidence": "low"},
                "lipinskiRules": {"passes": True, "violations": []},
            }
            return PropertyPredictionResponse(success=True, molecule=name, smiles=smiles, predictions=PropertyPrediction(**heuristic), error="heuristic", heuristic=True)
        # Validate into Pydantic model to enforce schema
        predictions = PropertyPrediction(**raw)
        cache.set(key, predictions.model_dump())
        return PropertyPredictionResponse(success=True, molecule=name, smiles=smiles, predictions=predictions)
    except Exception as e:
        # Heuristic on failure
        heuristic = {
            "toxicity": {"score": 30, "level": "medium", "explanation": f"Heuristic due to error: {e}"},
            "solubility": {"score": 50, "details": "Heuristic placeholder."},
            "drugLikeness": {"score": 50, "passes": True},
            "bioavailability": {"percentage": 50, "explanation": "Heuristic placeholder."},
            "bbbPenetration": {"canCross": False, "confidence": "low"},
            "lipinskiRules": {"passes": True, "violations": []},
        }
        return PropertyPredictionResponse(success=True, molecule=name, smiles=smiles, predictions=PropertyPrediction(**heuristic), error="heuristic", heuristic=True)


@router.post("/explain", response_model=ExplainResponse)
async def explain_property(payload: ExplainRequest, settings: Settings = Depends(require_openai)):
    svc = OpenAIService(model=settings.OPENAI_MODEL)
    try:
        text = await svc.explain_simple(payload.molecule, payload.property, payload.context)
        return ExplainResponse(success=True, text=text)
    except Exception as e:
        return ExplainResponse(success=False, text=f"Unable to explain: {e}")

