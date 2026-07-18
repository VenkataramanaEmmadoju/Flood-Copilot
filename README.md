# Flood Copilot 🌊

**AI-Powered Flood Copilot with Offline Emergency Support for Rural Telangana**

A hackathon project that helps citizens communicate faster with 112 and local responders during floods — using voice, text, and photos — even in low-connectivity environments.

[![Backend](https://img.shields.io/badge/backend-Express.js-green)](backend/)
[![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Llama%203-orange)](https://console.groq.com)
[![Frontend](https://img.shields.io/badge/frontend-TanStack%20Start-blue)](https://tanstack.com/start)

---

## Features

| Feature | Description |
|---------|-------------|
| 🎙 Voice report | Record voice in Telugu/English → AI emergency summary |
| 📝 Text report | Describe situation → structured AI summary |
| 📸 Photo analysis | Upload flood photo → severity + rescue advice |
| 🆘 SOS generator | Bilingual SOS in English + Telugu ready to relay to 112 |
| 🏠 Shelter finder | Live shelter list with district/village filters |
| 🚨 Flood alerts | IMD, CWC, TSDMA bulletins sorted by severity |
| 🌐 Translation | Telugu ↔ English ↔ Hindi via Groq |
| 📴 Survival kit | Offline emergency contacts, first aid, go-bag checklist |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TanStack Start (SSR), Tailwind CSS v4, shadcn/ui |
| Backend | Node.js, Express.js, Groq SDK |
| AI model | `llama3-8b-8192` (chat/voice/translate/SOS), `llama-3.2-11b-vision-preview` (image) |
| Package manager | Bun (frontend), npm (backend) |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- Bun ≥ 1.0
- A [Groq API key](https://console.groq.com) (free)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd flood-copilot

# Install frontend dependencies
bun install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and set GROQ_API_KEY=your_key_here
```

### 3. Run both services

**Terminal 1 — Frontend (port 5000):**
```bash
bun run dev
```

**Terminal 2 — Backend (port 8000):**
```bash
cd backend
PORT=8000 node server.js
# or: npm run dev   (uses nodemon for auto-reload)
```

The Vite dev server proxies `/api/*` to the backend automatically — no CORS config needed in dev.

Open **http://localhost:5000** in your browser.

---

## API Reference

All endpoints return `{ success: true, data: {...} }` or `{ success: false, error: { message: "..." } }`.

### GET endpoints

| Endpoint | Query params | Description |
|----------|-------------|-------------|
| `GET /api/health` | — | Service health check |
| `GET /api/shelters` | `district`, `status` | Relief shelter list |
| `GET /api/emergency` | `type` | Emergency contact numbers |
| `GET /api/tips` | `category`, `priority` | Flood safety tips |
| `GET /api/alerts` | `district`, `severity` | Flood bulletins |

### POST endpoints

| Endpoint | Body | Description |
|----------|------|-------------|
| `POST /api/chat` | `{ message, history? }` | Bilingual flood assistant |
| `POST /api/voice` | `{ transcript, language? }` | Voice → AI summary |
| `POST /api/image` | `multipart/form-data` field `image` | Flood photo analysis |
| `POST /api/translate` | `{ text, from, to }` | Te ↔ En ↔ Hi translation |
| `POST /api/sos` | `{ name, location, emergency, peopleAffected?, urgency?, contactNumber? }` | Bilingual SOS generator |

---

## Project Structure

```
flood-copilot/
├── src/                       # Frontend (TanStack Start)
│   ├── routes/
│   │   ├── index.tsx          # Home page
│   │   ├── report.tsx         # Emergency reporting (voice/text/photo + SOS)
│   │   ├── shelters.tsx       # Shelter finder
│   │   ├── alerts.tsx         # Flood alerts
│   │   ├── survival-kit.tsx   # Offline survival reference
│   │   ├── about.tsx
│   │   └── settings.tsx
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── ...                # App-specific components
│   └── lib/
│       ├── api.ts             # Typed API client (all endpoints)
│       └── types.ts           # Shared TypeScript types
│
├── backend/                   # Express.js API
│   ├── server.js              # Entry point
│   ├── config/                # Env + Groq client
│   ├── controllers/           # Request handlers
│   ├── routes/                # Express routers
│   ├── services/
│   │   └── groqService.js     # Groq chat + vision wrappers
│   ├── middleware/            # Error, rate limit, upload, validation
│   ├── data/                  # Seed data (shelters, alerts, tips, contacts)
│   └── utils/                 # Logger, response helpers
│
├── vite.config.ts             # Vite + TanStack Start config (with /api proxy)
├── render.yaml                # Render deployment config
└── README.md
```

---

## Deployment

### Replit

Both workflows are pre-configured:
- **Frontend** — `bun run dev` on port 5000 (webview)
- **Backend API** — `cd backend && PORT=8000 node server.js` (console)


---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ | — | Groq API key |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `CORS_ORIGINS` | No | localhost variants | Comma-separated allowed origins |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per minute |
| `MAX_FILE_SIZE_MB` | No | `10` | Image upload size limit |

### Frontend (root `.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `` (empty) | Backend base URL for production. Empty = use Vite proxy |

---

## Emergency Numbers (Telangana)

| Number | Service |
|--------|---------|
| **112** | All-in-one emergency |
| **1070** | Flood / Disaster helpline |
| **108** | Ambulance |
| **100** | Police |
| **101** | Fire & Rescue |

---

## License

MIT — built for a hackathon. Use freely.
