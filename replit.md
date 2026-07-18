# Flood Copilot

AI-Powered Flood Emergency App with Offline Support for Rural Telangana.

## Stack

- **Frontend**: React 19, TanStack Start (SSR), Tailwind CSS v4, shadcn/ui — runs via Bun
- **Backend**: Node.js + Express.js — communicates with Groq/Llama AI
- **AI**: Groq SDK (chat, voice, translation, SOS, image analysis)

## How to run

Both workflows are configured and start automatically:

| Workflow | Command | Port |
|----------|---------|------|
| Frontend | `bun run dev` | 5000 (webview) |
| Backend API | `cd backend && PORT=8000 node server.js` | 8000 |

## Required secrets

| Secret | Purpose |
|--------|---------|
| `GROQ_API_KEY` | All AI features (free tier at console.groq.com) |

## Project structure

```
/               — TanStack Start frontend (React, Vite)
/src/routes     — Page routes
/src/components — Shared UI components
/backend        — Express API server
/backend/routes — API route handlers
/backend/services — AI service wrappers (Groq)
/backend/controllers — Request handlers
```

## User preferences

- Keep existing project structure and stack (do not migrate or restructure).
