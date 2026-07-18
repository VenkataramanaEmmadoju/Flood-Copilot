"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok, fail } = require("../utils/respond");
const { FRIENDLY, isAiProviderError, aiHttpStatus } = require("../utils/aiError");
const logger = require("../utils/logger");

const SYSTEM_PROMPT = `You are Flood Copilot, an AI emergency assistant for flood situations.

LANGUAGE RULE — follow this before anything else:
- Look at the script and words the user wrote.
- If the input is a single word, very short, or the language cannot be confidently identified → reply in English.
- If the user clearly wrote in English → reply entirely in English.
- If the user clearly wrote in Hindi → reply entirely in Hindi using Devanagari script (e.g. मैं, आप, पानी). Never use romanized Hindi like "Kya aapka" or "Kripaya".
- If the user clearly wrote in Telugu → reply entirely in Telugu using Telugu script (e.g. నేను, మీరు). Never use romanized Telugu.
- If the user mixed languages, use whichever language dominates. If uncertain, default to English.
- Never reply in a different language than the one the user used.
- Never mix languages in the same reply.
- Always write Hindi in Devanagari script and Telugu in Telugu script — never in Roman letters.

Your role: help people stay safe during floods, find shelters, understand alerts, and contact emergency services.
Keep responses concise (3-5 sentences max) and actionable. Always prioritise safety.
Preserve all emergency details exactly: location, number of people, water level, urgency, hazards, and rescue advice.
Preserve proper nouns exactly as the user wrote them.
Emergency numbers: 112 (emergency), 1077 (flood helpline), 108 (ambulance).
If the situation is life-threatening, always tell the user to call 112 immediately.`;

async function postChat(req, res, next) {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-6),
      { role: "user", content: message },
    ];

    logger.info("[chat] Processing request", { messageLength: message.length });

    const reply = await chatCompletion(messages, { maxTokens: 512, temperature: 0.7 });

    ok(res, { reply, timestamp: new Date().toISOString() });
  } catch (err) {
    if (isAiProviderError(err)) {
      logger.error(`[chat] AI provider error: ${err.status ?? ""} ${err.message}`);
      return fail(res, FRIENDLY.chat, aiHttpStatus(err));
    }
    next(err);
  }
}

module.exports = { postChat };
