# FastAPI Backend (Migration from Node.js)

This backend replaces the previous Node/Express proxy to better support AI/ML libraries and scientific tooling.

## Endpoints (kept compatible)
- GET /api/v1/health → { "status": "ok", "message": "API is running" }
- POST /api/v1/molecule/test-analysis → { success, analysis, molecule }
- Compatibility: POST /api/chat (accepts { moleculeName }) maps to the analysis route

## Features
- FastAPI with async handlers
- CORS configured for FRONTEND_URL
- Pydantic models for request/response validation
- OpenAI service layer with AsyncOpenAI
- In-memory caching (10 min TTL) and simple rate limiting
- Auto docs at /docs and /redoc

## Environment
Create .env (see .env.example). This project is configured to use Azure OpenAI deployments.
```
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=<your-deployment-name>
OPENAI_API_KEY=""  # leave blank when using Azure keys via AZURE_OPENAI_API_KEY or OPENAI_API_KEY if set
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
OPENAI_MODEL=gpt-4o
```

## Run
```
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
# Ensure `httpx` is available for Azure HTTP calls. If you previously installed the `openai` SDK only, that's not required.
uvicorn app.main:app --reload --port 8000
```

## Frontend Dev Setup
- Vite dev proxy should point /api → http://localhost:8000
- The app already calls /api/chat on the test page; a compatibility route is provided.
- Prefer migrating calls to /api/v1/molecule/test-analysis for future features.

## Migration Notes
- Node server is no longer required; use FastAPI.
- Endpoints preserved; added /api/chat compatibility.
- Improved structure for ML/RDKit integration later.

## Next Steps
- Add RDKit validation utilities in app/utils
- Extend analysis schema for richer outputs
- Persist caching with Redis if needed
