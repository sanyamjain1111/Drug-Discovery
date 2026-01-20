from fastapi import APIRouter, Depends, HTTPException, status
from ..models.reactions import ReactionRequest, ReactionResponse, ReactionProduct
from ...core.config import Settings, get_settings
from ...core.dependencies import require_openai
from ...services.openai_service import OpenAIService
from ...utils.molecule_utils import cache, cache_key_molecule, rate_limiter

router = APIRouter(prefix="/reactions")

@router.post('/predict', response_model=ReactionResponse)
async def predict_reaction(payload: ReactionRequest, settings: Settings = Depends(require_openai)):
    if not rate_limiter.allow('reactions'):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail='Rate limit exceeded')

    key = cache_key_molecule('rxn:' + payload.reactantA.strip().lower() + '|' + payload.reactantB.strip().lower() + '|' + (payload.conditions.catalyst or ''))
    cached = cache.get(key)
    if cached:
        return cached

    svc = OpenAIService(model=settings.OPENAI_MODEL)
    try:
        raw = await svc.predict_reaction(payload.reactantA, payload.reactantB, payload.conditions.model_dump())
        if not raw:
            resp = ReactionResponse(
                equation=f"{payload.reactantA} + {payload.reactantB} -> (no confident prediction)",
                products=[ReactionProduct(name='Uncertain product', confidence=20, byproduct=False)],
                mechanismSteps=["Heuristic placeholder: model unavailable."],
                yieldPercent=30,
                energyChange='neutral',
                heuristic=True,
                error='heuristic'
            )
            cache.set(key, resp.model_dump())
            return resp
        resp = ReactionResponse(**raw)
        cache.set(key, resp.model_dump())
        return resp
    except Exception as e:
        resp = ReactionResponse(
            equation=f"{payload.reactantA} + {payload.reactantB} -> (uncertain)",
            products=[ReactionProduct(name='Uncertain product', confidence=20, byproduct=False)],
            mechanismSteps=[f"Heuristic due to error: {e}"],
            yieldPercent=25,
            energyChange='neutral',
            heuristic=True,
            error='heuristic'
        )
        return resp
