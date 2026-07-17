"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok } = require("../utils/respond");
const logger = require("../utils/logger");

async function postTranslate(req, res, next) {
  try {
    const { text, from = "auto", to } = req.body;

    logger.info("[translate] Translation request", { from, to, textLength: text.length });

    const directionMap = {
      "te-en": "Translate the following Telugu text to English.",
      "en-te": "Translate the following English text to Telugu.",
      "hi-en": "Translate the following Hindi text to English.",
      "en-hi": "Translate the following English text to Hindi.",
      "te-hi": "Translate the following Telugu text to Hindi.",
    };

    let instruction;
    if (from === "auto") {
      instruction = `Detect the language of the following text and translate it to ${
        to === "te" ? "Telugu" : to === "hi" ? "Hindi" : "English"
      }. Return only the translated text, no explanation.`;
    } else {
      const key = `${from}-${to}`;
      instruction =
        directionMap[key] ||
        `Translate the following text from ${from} to ${to}. Return only the translated text.`;
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a precise bilingual translator specialising in Telugu, English, and Hindi for emergency communications. Return ONLY the translated text — no preamble, no explanation, no quotes.",
      },
      { role: "user", content: `${instruction}\n\n${text}` },
    ];

    const translated = await chatCompletion(messages, { maxTokens: 512, temperature: 0.2 });

    ok(res, {
      original: text,
      translated,
      from: from === "auto" ? "detected" : from,
      to: to || "en",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postTranslate };
