from fastapi import APIRouter
from ..models.admet import AdmetRequest, AdmetResponse
from ...services.openai_service import OpenAIService
from ...core.config import get_settings

router = APIRouter(prefix="/admet")


@router.post('/analyze', response_model=AdmetResponse)
async def analyze(req: AdmetRequest):
    try:
        settings = get_settings()
        oa = OpenAIService(model=settings.OPENAI_MODEL)
        obj = await oa.admet_predict(req.molecule, req.smiles)
        if not obj:
            return AdmetResponse(ok=False, error='Empty ADMET response')
        return AdmetResponse(ok=True, **obj)
    except Exception as e:
        return AdmetResponse(ok=False, error=str(e))
