"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok } = require("../utils/respond");
const logger = require("../utils/logger");

const SYSTEM_PROMPT = `You are Flood Copilot, a bilingual voice assistant for flood emergencies in Telangana.
The user has spoken their message (transcribed to text). Respond clearly and concisely in the same language.
Focus on immediate safety: evacuation, shelter locations, emergency contacts (112, 1077, 108).
Maximum 3 sentences. Be calm and clear.`;

async function postVoice(req, res, next) {
  try {
    const { transcript, language = "auto" } = req.body;

    logger.info("[voice] Processing transcript", { length: transcript.length, language });

    const langHint =
      language !== "auto"
        ? `The user is speaking in ${language}. Respond in ${language}.`
        : "Detect the language and respond in the same language (Telugu or English).";

    const messages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n${langHint}` },
      { role: "user", content: transcript },
    ];

    const reply = await chatCompletion(messages, { maxTokens: 256, temperature: 0.5 });

    ok(res, {
      reply,
      detectedLanguage: language,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postVoice };
