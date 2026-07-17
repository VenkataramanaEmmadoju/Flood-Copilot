# Flood Copilot — Backend

Express.js API backend for the Telugu Flood Copilot hackathon project.

## Stack

- **Runtime**: Node.js ≥ 18
- **Framework**: Express.js
- **AI**: Groq SDK (llama3-8b-8192 + llama-3.2-11b-vision-preview)
- **Middleware**: helmet, cors, morgan, multer, express-rate-limit, express-validator

---

## Quick Start

```bash
cd backend
npm install
cp .env.example .env    # then fill in GROQ_API_KEY
npm run dev             # development (nodemon)
npm start               # production
```

---

## Environment Variables

| Variable              | Required | Default                        | Description                        |
|-----------------------|----------|--------------------------------|------------------------------------|
| `GROQ_API_KEY`        | ✅       | —                              | Your Groq API key                  |
| `PORT`                | No       | `5000`                         | Server port                        |
| `NODE_ENV`            | No       | `development`                  | `development` or `production`      |
| `CORS_ORIGINS`        | No       | localhost variants             | Comma-separated allowed origins    |
| `RATE_LIMIT_WINDOW_MS`| No       | `60000`                        | Rate-limit window in ms            |
| `RATE_LIMIT_MAX`      | No       | `60`                           | Max requests per window            |
| `MAX_FILE_SIZE_MB`    | No       | `10`                           | Max image upload size              |

---

## API Endpoints

### `GET /api/health`
Server health check.

### `GET /api/tips`
Flood safety tips. Query: `?category=evacuation&priority=critical`

### `GET /api/shelters`
Relief shelter list. Query: `?district=Warangal&status=open`

### `GET /api/emergency`
Emergency contact numbers. Query: `?type=flood`

### `POST /api/chat`
Bilingual flood assistant (Telugu/English).
```json
{ "message": "నీరు పెరుగుతుంది, ఏం చేయాలి?", "history": [] }
```

### `POST /api/voice`
Voice transcript → AI response.
```json
{ "transcript": "water is rising near my house", "language": "en" }
```

### `POST /api/image`
Upload flood photo for severity analysis.
- `Content-Type: multipart/form-data`
- Field name: `image` (JPEG/PNG/WEBP, max 10 MB)

### `POST /api/translate`
Telugu ↔ English translation.
```json
{ "text": "వరద వస్తుంది", "from": "te", "to": "en" }
```

### `POST /api/sos`
Generate bilingual SOS message.
```json
{
  "name": "Raju",
  "location": "Bhadrachalam town, near river bank",
  "emergency": "House flooded, roof damage, need evacuation",
  "peopleAffected": 4,
  "urgency": "critical",
  "contactNumber": "9876543210"
}
```

---

## Project Structure

```
backend/
├── server.js           # Entry point
├── config/
│   ├── env.js          # Validated env config
│   └── groq.js         # Groq client singleton
├── controllers/        # Request handlers
├── routes/             # Express routers
├── services/
│   └── groqService.js  # Groq chat + vision wrappers
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── rateLimiter.js
│   ├── uploadMiddleware.js
│   └── validate.js
├── data/               # Static data (shelters, tips, contacts)
├── utils/
│   ├── logger.js
│   └── respond.js
└── uploads/            # Temp image uploads (auto-cleaned)
```

---

## Deployment

### Render
1. Set root directory to `backend/`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add `GROQ_API_KEY` in environment variables

### Replit
1. Set run command: `cd backend && npm start`
2. Add `GROQ_API_KEY` as a Replit Secret
3. Server binds to `0.0.0.0` automatically

### Frontend API Base URL
The frontend should call `http://localhost:5000/api` in development.
For production, update the base URL to your deployed backend domain.
