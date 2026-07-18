---
name: Production deployment architecture
description: How Flood Copilot is deployed — single-process Express, no nitro at runtime, SPA via pre-generated index.html
---

## Rule
Production uses a single Express process. The nitro SSR server is NOT started at runtime.

## Why
Nitro (`.output/server/index.mjs`) crashes silently within 1 second in Replit's autoscale production container. The exact cause is unresolvable without access to the container (likely a port bind failure — srvx silently swallows listen errors and Node exits with no event loop). Two-process startup is fragile; single-process is reliable.

## How it works
1. **Build step** runs `node scripts/generate-index.js` after `bun run build`.
   - Starts nitro on port 3099 (high port, avoids conflicts).
   - Fetches `/` from nitro, saves as `.output/public/index.html`.
   - Kills nitro.
2. **Run step**: `bash start-production.sh` → `NODE_ENV=production node backend/server.js`.
   - Express listens on `process.env.PORT` (Replit injects 8080 → external 80).
   - `express.static('../.output/public')` serves hashed assets.
   - SPA catch-all: `res.sendFile(indexHtml)` for all non-API routes.
   - All `/api/*` routes handled normally.

## How to apply
- If the frontend needs SSR changes, edit source and rebuild — `generate-index.js` re-captures HTML.
- If adding new routes to Express, they go BEFORE the SPA catch-all (line ~79 in server.js).
- Do NOT add a separate nitro process to the run command — it will crash.
- The `start-production.sh` must use `exec node server.js` (not `NODE_ENV=production exec ...`).
