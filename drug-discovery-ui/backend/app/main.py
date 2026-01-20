from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .api.routes.health import router as health_router
from .api.routes.molecule import router as molecule_router
from .api.routes.interactions import router as interactions_router
from .api.routes.reactions import router as reactions_router
from .api.routes.structure import router as structure_router
from .api.routes.generator import router as generator_router
from .api.routes.docking import router as docking_router
from .api.routes.admet import router as admet_router
from .api.routes.retro import router as retro_router
from .api.routes.feedback import router as feedback_router

settings = get_settings()

app = FastAPI(title="AI Drug Discovery API", version="0.1.0", openapi_url="/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = "/api/v1"
app.include_router(health_router, prefix=api_prefix)
app.include_router(molecule_router, prefix=api_prefix)
app.include_router(interactions_router, prefix=api_prefix)
app.include_router(reactions_router, prefix=api_prefix)
app.include_router(structure_router, prefix=api_prefix)
app.include_router(generator_router, prefix=api_prefix)
app.include_router(docking_router, prefix=api_prefix)
app.include_router(admet_router, prefix=api_prefix)
app.include_router(retro_router, prefix=api_prefix)
app.include_router(feedback_router, prefix=api_prefix)

# Frontend compatibility route: /api/chat
@app.post("/api/chat")
async def compat_chat_proxy(payload: dict):
    # Proxy to /api/v1/molecule/compat-chat
    from fastapi import HTTPException
    from fastapi.encoders import jsonable_encoder
    import httpx

    molecule_name = payload.get("moleculeName") or payload.get("molecule")
    if not molecule_name or not isinstance(molecule_name, str):
        raise HTTPException(status_code=400, detail="moleculeName is required")
    async with httpx.AsyncClient() as client:
        r = await client.post("http://localhost:8000/api/v1/molecule/compat-chat", json={"molecule": molecule_name})
        return r.json()
