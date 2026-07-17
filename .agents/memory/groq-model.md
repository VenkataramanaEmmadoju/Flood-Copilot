---
name: Groq model selection
description: Which Groq models are live; llama3-8b-8192 was decommissioned in mid-2026
---

## Rule
Never use `llama3-8b-8192` — it is decommissioned and returns a 400 error.

**Current defaults (backend/config/env.js):**
- Chat / voice / translate / SOS: `llama-3.1-8b-instant`
- Vision (image analysis): `llama-3.2-11b-vision-preview`

**Why:** Groq decommissioned llama3-8b-8192 in July 2026. llama-3.1-8b-instant is the recommended drop-in.

**How to apply:** Any new Groq call must use one of the above model IDs, or read `GROQ_MODEL` / `GROQ_VISION_MODEL` env vars set by the operator.
