from fastapi import APIRouter
from ..models.retro import RetroRequest, RetroResponse, RetroRoute, RetroStep, RetroMeta
from ...services.openai_service import OpenAIService
from ...core.config import get_settings

router = APIRouter(prefix="/retro")


@router.post('/plan', response_model=RetroResponse)
async def plan(req: RetroRequest):
    try:
        settings = get_settings()
        svc = OpenAIService(model=settings.OPENAI_MODEL)
        obj = await svc.retro_plan(req.target, req.constraints.model_dump(), req.starting, req.routes)
        if not obj:
            return RetroResponse(ok=False, error='Empty response from model')
        routes = [
            RetroRoute(
                id=r.get('id') or f"R{i+1}",
                steps=[RetroStep(**s) for s in r.get('steps', [])],
                overallYield=r.get('overallYield'),
                cost=r.get('cost'),
                time=r.get('time'),
                safety=r.get('safety'),
                difficulty=r.get('difficulty'),
                hazards=r.get('hazards'),
                greenScore=r.get('greenScore'),
                references=r.get('references'),
            ) for i, r in enumerate(obj.get('routes', []))
        ]
        meta = obj.get('meta') or {}
        return RetroResponse(ok=True, routes=routes, meta=RetroMeta(**meta) if meta else None)
    except Exception as e:
        return RetroResponse(ok=False, error=str(e))
