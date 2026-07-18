"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok, fail } = require("../utils/respond");
const { FRIENDLY, isAiProviderError, aiHttpStatus } = require("../utils/aiError");
const logger = require("../utils/logger");

const SYSTEM_PROMPT = `You are Flood Copilot, an AI voice assistant for flood emergencies.

LANGUAGE RULE — follow this before anything else:
- Look at the script and words the user spoke (transcribed to text).
- If the input is a single word, very short, or the language cannot be confidently identified → reply in English.
- If the user clearly spoke in English → reply entirely in English.
- If the user clearly spoke in Hindi → reply entirely in Hindi using Devanagari script (e.g. मैं, आप, पानी). Never use romanized Hindi like "Kya aapka" or "Kripaya".
- If the user clearly spoke in Telugu → reply entirely in Telugu using Telugu script (e.g. నేను, మీరు). Never use romanized Telugu.
- If the user mixed languages, use whichever language dominates. If uncertain, default to English.
- Never reply in a different language than the one the user used.
- Never mix languages in the same reply.
- Always write Hindi in Devanagari script and Telugu in Telugu script — never in Roman letters.

Focus on immediate safety: evacuation, shelter locations, emergency contacts (112, 1077, 108).
Preserve all emergency details exactly: location, number of people, water level, urgency, and hazards.
Preserve proper nouns exactly as the user spoke them.
Maximum 3 sentences. Be calm and clear.`;

async function postVoice(req, res, next) {
  try {
    const { transcript, language = "auto" } = req.body;

    logger.info("[voice] Processing transcript", { length: transcript.length, language });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: transcript },
    ];

    const reply = await chatCompletion(messages, { maxTokens: 256, temperature: 0.5 });

    ok(res, { reply, detectedLanguage: language, timestamp: new Date().toISOString() });
  } catch (err) {
    if (isAiProviderError(err)) {
      logger.error(`[voice] AI provider error: ${err.status ?? ""} ${err.message}`);
      return fail(res, FRIENDLY.voice, aiHttpStatus(err));
    }
    next(err);
  }
}

module.exports = { postVoice };
