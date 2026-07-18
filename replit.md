# Flood Copilot

AI-powered flood emergency assistant for rural Telangana. Helps citizens report emergencies, find shelters, and receive flood alerts via voice, text, and image — even in low-connectivity environments.

## Stack

- **Frontend:** React 19, TanStack Start (SSR), Tailwind CSS v4, shadcn/ui — managed with Bun
- **Backend:** Node.js + Express — managed with npm

## How to run

Two workflows must both be running:

| Workflow | Command | Port |
|---|---|---|
| Frontend | `bun run dev` | 5000 |
| Backend API | `cd backend && PORT=8000 node server.js` | 8000 |

The frontend Vite dev server proxies `/api/*` requests to the backend at port 8000, so no CORS configuration is needed in development.

## Required secrets

| Secret | Where used |
|---|---|
| `GROQ_API_KEY` | Backend AI features (chat, voice, image analysis) |

## Key directories

- `src/` — React frontend (routes, components, hooks)
- `backend/` — Express API server and AI integrations
- `backend/server.js` — API entry point

## User preferences
