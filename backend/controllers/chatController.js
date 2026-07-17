"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok } = require("../utils/respond");
const logger = require("../utils/logger");

const SYSTEM_PROMPT = `You are Flood Copilot, a bilingual flood emergency assistant for rural Telangana, India.
You support Telugu and English. Always respond in the same language the user wrote in.
Your role: help people stay safe during floods, find shelters, understand alerts, and contact emergency services.
Keep responses concise (3-5 sentences max) and actionable. Always prioritise safety.
Emergency numbers: 112 (emergency), 1077 (flood helpline), 108 (ambulance).
If the situation is life-threatening, always tell the user to call 112 immediately.`;

async function postChat(req, res, next) {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-6), // keep last 3 exchanges for context
      { role: "user", content: message },
    ];

    logger.info("[chat] Processing request", { messageLength: message.length });

    const reply = await chatCompletion(messages, { maxTokens: 512, temperature: 0.7 });

    ok(res, {
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postChat };
