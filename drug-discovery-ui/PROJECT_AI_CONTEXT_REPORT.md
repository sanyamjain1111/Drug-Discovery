# Project AI Context Report (Frontend + Backend Mapping)

Date: 2026-01-13  
Repo: `drug-discovery-ui/`

## Purpose
This document gives a future AI/dev full context of the existing project: what’s implemented, how the frontend and backend connect, which features are complete, and what’s missing.

---

## 1) High-level architecture

### Frontend
- Stack: React 18 + Vite + TypeScript + Tailwind + React Router.
- Routing: `src/router.tsx`.
- API access: `src/services/*.ts` (all calls go through `fetch()` to `/api/...`).
- Dev proxy: Vite proxies `/api` → `http://localhost:8000` via `vite.config.ts`.

### Backend
- Stack: FastAPI (async), Pydantic schemas, RDKit utilities, httpx.
- Base path prefix: all routers are mounted under `/api/v1` (`backend/app/main.py`).
- CORS: allows the configured `FRONTEND_URL`.
- API docs: `/docs` and `/openapi.json` when backend is running.

### Runtime relationship
- Frontend calls `/api/v1/...`.
- In development, Vite forwards these requests to the FastAPI server (port 8000).

---

## 2) How to run locally

### Frontend
From repo root:
- `npm install`
- `npm run dev`  
  Opens the Vite dev server (default `http://localhost:5173`) and proxies `/api` to the backend.

### Backend
From `backend/`:
- `python -m venv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`
- `uvicorn app.main:app --reload --port 8000`

### Environment variables (backend)
Backend reads `.env` in `backend/` (see `backend/README.md`). Intended variables:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_DEPLOYMENT`
- `AZURE_OPENAI_API_VERSION` (default in code)
- `OPENAI_API_KEY` (or Azure key env)
- `OPENAI_MODEL` (default `gpt-4o` in code)
- `FRONTEND_URL` (default `http://localhost:5173`)

IMPORTANT SECURITY NOTE (current code):
- `backend/app/core/config.py` and `backend/app/services/openai_service.py` contain hardcoded secrets/endpoint/deployment defaults.
- This should be removed and replaced with environment-only configuration.

---

## 3) Frontend routes (screens)

Defined in `src/router.tsx`:

### Real feature routes
- `/` → Home
- `/molecule-input` → Molecule Input (prototype UI)
- `/property-predictor` → Property Predictor (wired to backend)
- `/drug-interactions` → Drug Interaction Analyzer (wired to backend)
- `/drug-generator` → Drug Generator (wired to backend)
- `/docking` → Docking (wired to backend)
- `/admet` → ADMET Page (currently UI-only mock)
- `/retrosynthesis` → Retrosynthesis Planner (wired to backend)
- `/openai-test` → OpenAI connectivity test (wired to backend)
- `/help/*` → static help pages + feedback form (feedback is wired)
- `/settings` → Settings (localStorage only)
- `/about` → About
- `/workflows` → Example Workflows (links)

### Placeholder routes (not implemented)
- `/feature1` Target Prediction (placeholder)
- `/feature2` Molecule Generation (placeholder)
- `/feature3` Property Screening (placeholder)
- `/feature4` ADMET (placeholder)
- `/feature5` 3D Visualizer (placeholder)
- `/feature6` Datasets (placeholder)
- `/feature7` Pipelines (placeholder)

UI navigation note:
- Home page cards link to `/feature4` and `/feature5` for ADMET/3D Visualizer, but the actual ADMET route is `/admet` and there is no dedicated 3D Visualizer page (3D is embedded in other pages).

---

## 4) Backend API surface (FastAPI)

All are under `/api/v1` except the legacy compatibility `/api/chat`.

### Health
- `GET /api/v1/health`

### Molecule
Prefix: `/api/v1/molecule`
- `POST /test-analysis` → OpenAI molecule analysis text
- `POST /compat-chat` → response shape used by frontend OpenAI test
- `POST /validate-structure` → RDKit validation report (SMILES required)
- `POST /predict-properties` → property prediction JSON (with heuristic fallback)
- `POST /explain` → short explanation text for a property

Legacy compatibility:
- `POST /api/chat` → proxies to `/api/v1/molecule/compat-chat`

### Interactions
Prefix: `/api/v1/interactions`
- `POST /analyze` → drug-drug interaction report JSON (with heuristic fallback)
- `POST /validate-drug-structure` → RDKit validation for an optional drug SMILES

### Reactions
Prefix: `/api/v1/reactions`
- `POST /predict` → reaction prediction JSON (with heuristic fallback)

### Structure
Prefix: `/api/v1/structure`
- `GET /?query=...&format=json|sdf` → PubChem SDF fetch + convert to JSON
- `POST /generate-ai` → AI-generated SMILES/IUPAC/formula/description

### Generator
Prefix: `/api/v1/generator`
- `POST /run` → generate candidates + RDKit validate + rank
- `POST /validate-batch` → validate up to 1000 SMILES

### Docking
Prefix: `/api/v1/docking`
- `POST /analyze` → AI docking-style analysis JSON
- `POST /validate-ligand` → RDKit validation + docking suitability heuristics

### ADMET
Prefix: `/api/v1/admet`
- `POST /analyze` → ADMET prediction JSON

### Retrosynthesis
Prefix: `/api/v1/retro`
- `POST /plan` → retrosynthesis planning JSON

### Feedback
Prefix: `/api/v1/feedback`
- `POST /submit` → logs feedback and returns ok

---

## 5) Frontend → backend mapping (feature completeness matrix)

Legend:
- ✅ Complete: UI exists and calls backend endpoints.
- 🟡 Partial: backend exists but UI doesn’t use it (or navigation points to placeholders).
- ❌ Missing: UI exists but backend not implemented; or route is placeholder.

| Feature / Route | Frontend entry | Frontend service calls | Backend endpoints | Status | Notes / gaps |
|---|---|---|---|---|---|
| Health | (no UI) | (none) | `GET /api/v1/health` | 🟡 Partial | Backend only; useful for monitoring. |
| Molecule input (`/molecule-input`) | `src/features/molecule-input/MoleculeInputPage.tsx` | none (alerts only) | molecule endpoints exist | 🟡 Partial | UI is prototype; could wire `validate-structure` + `test-analysis`. |
| OpenAI test (`/openai-test`) | `src/features/openai-test/OpenAITestPage.tsx` | `chatAboutMolecule()` | `POST /api/v1/molecule/compat-chat` (+ `/api/chat` fallback) | ✅ Complete | Confirms backend OpenAI connectivity. |
| Property predictor (`/property-predictor`) | `src/features/property-predictor/PropertyPredictorPage.tsx` | `predictProperties`, `fetchStructureJSON`, `explainProperty`, `analyzeAdmet`, `generateStructureWithAI` | `/molecule/predict-properties`, `/structure`, `/molecule/explain`, `/admet/analyze`, `/structure/generate-ai` | ✅ Complete | Most integrated screen. ADMET is shown here as “summary”. |
| Drug interactions (`/drug-interactions`) | `src/features/drug-interactions/DrugInteractionPage.tsx` | `analyzeInteractions` + reaction tab uses `predictReaction` | `/interactions/analyze`, `/reactions/predict` | ✅ Complete | Has history + live debounced analysis. |
| Drug generator (`/drug-generator`) | `src/features/drug-generator/DrugGeneratorPage.tsx` | `runGeneration` | `/generator/run` | ✅ Complete | Page text says “UI only” but it’s already wired. |
| Docking (`/docking`) | `src/features/docking/DockingPage.tsx` | `analyzeDocking` | `/docking/analyze` | ✅ Complete | Backend is AI-guided analysis (not true physics docking). |
| ADMET page (`/admet`) | `src/features/admet/AdmetPage.tsx` | none (all mock) | `/admet/analyze` exists | 🟡 Partial | Backend exists but this page isn’t wired; PropertyPredictor does call ADMET. |
| Retrosynthesis (`/retrosynthesis`) | `src/features/retrosynthesis/RetroPlannerPage.tsx` | `planRetrosynthesis` | `/retro/plan` | ✅ Complete | Falls back to mock routes if backend fails. |
| Feedback (`/help/feedback`) | `src/features/help/FeedbackForm.tsx` | direct `fetch()` | `/feedback/submit` | ✅ Complete | Backend just logs; no persistence. |
| Settings (`/settings`) | `src/features/settings/SettingsPage.tsx` | none | none | 🟡 Partial | Stores API key in localStorage only; backend does not read it. |
| Placeholder features (`/feature1..7`) | `src/router.tsx` placeholder view | none | none | ❌ Missing | Needs backend + real pages or remove. |

---

## 6) Backend endpoints not currently used by the frontend

These exist but are not called by current UI flows:
- `POST /api/v1/molecule/test-analysis`
- `POST /api/v1/molecule/validate-structure`
- `POST /api/v1/interactions/validate-drug-structure`
- `POST /api/v1/docking/validate-ligand`
- `POST /api/v1/generator/validate-batch`

These are good candidates to wire into the UI next (validation before running expensive analysis, richer molecule input workflow, etc.).

---

## 7) Known issues / risks (important for future implementation)

### Critical: secrets committed in code
- Hardcoded OpenAI/Azure key-like values exist in:
  - `backend/app/core/config.py`
  - `backend/app/services/openai_service.py`
- Fix: remove literals, require env vars only, and add `.env` to `.gitignore` (if not already).

### Config mismatch / misleading checks
- `require_openai()` checks `settings.OPENAI_API_KEY`, but OpenAIService currently sets `self.api_key` from a hardcoded default first.
- This can mask missing env setup and is unsafe.

### ADMET UX mismatch
- There is a real backend ADMET endpoint, and PropertyPredictor already uses it.
- The dedicated `/admet` page is still mock-only.

### Navigation mismatch on Home
- Home “ADMET Analysis” card links to `/feature4` (placeholder) not `/admet`.
- Home “3D Visualizer” card links to `/feature5` (placeholder) even though 3D exists in other screens.

---

## 8) Recommended next implementation backlog (ordered)

1) **Security cleanup (must-do)**
   - Remove hardcoded API keys/endpoints from backend code.
   - Document required `.env` values clearly.

2) **Wire Molecule Input to backend**
   - Hook MoleculeInput “Analyze” button to:
     - `POST /api/v1/molecule/validate-structure` (if mode = smiles)
     - `POST /api/v1/molecule/test-analysis` or `/compat-chat` (if mode = name)

3) **Wire `/admet` page to `/api/v1/admet/analyze`**
   - Reuse MoleculeInput, call backend, render real results.

4) **Fix Home links**
   - Change ADMET card `/feature4` → `/admet`.
   - Replace 3D Visualizer placeholder with a real page or point it to an existing 3D-enabled screen.

5) **Add validation before expensive calls**
   - Docking: call `/docking/validate-ligand` before `/docking/analyze`.
   - Generator: optionally validate seed SMILES / batch.

6) **Persistence (optional)**
   - Feedback: store to DB or send email.
   - Add Redis for cache if needed.

---

## 9) “Single source of truth” pointers

Frontend:
- Routes: `src/router.tsx`
- API calls: `src/services/*.ts`
- Key pages:
  - `src/features/property-predictor/PropertyPredictorPage.tsx`
  - `src/features/drug-interactions/DrugInteractionPage.tsx`
  - `src/features/drug-generator/DrugGeneratorPage.tsx`
  - `src/features/docking/DockingPage.tsx`
  - `src/features/retrosynthesis/RetroPlannerPage.tsx`

Backend:
- App entry: `backend/app/main.py`
- Routers: `backend/app/api/routes/*.py`
- Schemas: `backend/app/api/models/*.py`
- OpenAI wrapper: `backend/app/services/openai_service.py`
- RDKit utils: `backend/app/utils/chemo_utils.py`

---

If you want, I can also generate a second doc that’s “implementation-oriented” (exact payload shapes, example requests/responses, and a step-by-step integration plan per feature).