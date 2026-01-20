# AI Drug Discovery UI (Phase 1)

Modern React (Vite + TS) UI shell with Tailwind and a blue/teal gradient theme.

## Tech
- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router v6
- Three.js (placeholder component ready)

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview build
- `npm run lint` – lint source
- `npm run format` – format with Prettier

## Env
Create a `.env` at project root (server reads this):
```
OPENAI_API_KEY=your_real_key_here
# Optional
# OPENAI_MODEL=gpt-4o
# OPENAI_BASE_URL=https://api.openai.com/v1
```

Important: Do not put secrets in client `.env.*` files with `VITE_` prefix.

## Structure
- src/components – reusable UI and layout
- src/features – feature-specific views
- src/services – API placeholders
- src/utils – helper functions
- src/styles – Tailwind entry
- src/assets – static assets

## Run locally
1. `npm install`
2. Create `.env` with `OPENAI_API_KEY`
3. `npm run dev` (runs UI and local API proxy)
4. Open the URL shown in the terminal

### Test OpenAI connection
- Go to `/openai-test` in the app, enter a molecule name, and send.
