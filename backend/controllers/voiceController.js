"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok, fail } = require("../utils/respond");
const { FRIENDLY, isAiProviderError, aiHttpStatus } = require("../utils/aiError");
const logger = require("../utils/logger");

/**
 * Detect language from the transcript using Unicode script ranges.
 * Works when the browser transcribes in native script (Devanagari / Telugu).
 * Falls back to "unknown" when the transcript is romanized (Latin-only).
 *
 * Single word → always "en" (safe default per product spec).
 */
function detectScriptLanguage(transcript) {
  const words = transcript.trim().split(/\s+/);
  if (words.length <= 1) return "en";

  let devanagari = 0;
  let telugu = 0;
  let total = 0;

  for (const ch of transcript) {
    if (ch.trim() === "") continue;
    total++;
    const cp = ch.codePointAt(0);
    if (cp >= 0x0900 && cp <= 0x097f) devanagari++;
    else if (cp >= 0x0c00 && cp <= 0x0c7f) telugu++;
  }

  const threshold = total * 0.15;
  if (devanagari >= threshold) return "hi";
  if (telugu >= threshold) return "te";
  return "unknown"; // Latin script — could be English or romanized Hindi/Telugu
}

const SYSTEM_PROMPT = `You are Flood Copilot, an AI voice assistant for flood emergencies in Telangana, India.

STEP 1 — DETECT LANGUAGE:
The transcript may be in English, Hindi, or Telugu.
The speech recognition may have transcribed the user's words phonetically in Latin letters (romanized).
Identify the language by vocabulary and phonetic patterns:
- Telugu patterns: words like "nenu", "memu", "velluku", "vachindi", "unnaru", "undi", "oka", "maa", "inti", "kaavali", "help kaavali", "paristhiti", "vadakamma", "cheyyandi"
- Hindi patterns: words like "mujhe", "humein", "paani", "madad", "chahiye", "bahut", "ghar", "mein", "hai", "hain", "log", "aayi", "aa gaya", "zyada", "karo", "kijiye"
- English: all other standard English vocabulary

STEP 2 — FORMAT YOUR RESPONSE (mandatory, no exceptions):
On the VERY FIRST LINE write only the language code: en, hi, or te
From the SECOND LINE onward write the emergency summary in that language.

LANGUAGE OUTPUT RULES:
- If language is "en": write the summary in English only.
- If language is "hi": write the summary in Hindi using Devanagari script only (e.g. मैं, पानी, खतरा, मदद). Never use romanized Hindi.
- If language is "te": write the summary in Telugu using Telugu script only (e.g. నేను, వరదలు, ప్రమాదం, సహాయం). Never use romanized Telugu.
- Never mix languages. Never skip the language code line.
- EXCEPTION: if the transcript is a single word or too short to identify → write "en" on line 1, then reply in English.

CONTENT RULES:
Focus on immediate safety: evacuation, shelter locations, emergency contacts (112, 1077, 108).
Preserve all emergency details: location, number of people, water level, urgency, hazards.
Maximum 3 sentences in the summary. Be calm and clear.`;

async function postVoice(req, res, next) {
  try {
    const { transcript, language = "auto" } = req.body;

    // If caller passes an explicit language, skip detection entirely.
    let detectedLang = language && language !== "auto" ? language : null;

    // Fast-path: detect from Unicode script (works when browser outputs native script).
    if (!detectedLang) {
      const scriptLang = detectScriptLanguage(transcript);
      if (scriptLang !== "unknown") detectedLang = scriptLang;
    }

    // If still unknown (romanized Latin text), let the LLM detect via vocabulary patterns.
    // We use the two-line response format: line 1 = language code, rest = summary.
    const useLLMDetection = !detectedLang;

    logger.info("[voice] Processing transcript", {
      length: transcript.length,
      clientLang: language,
      detectedLang: detectedLang || "llm-detect",
    });

    let reply;
    let finalLang;

    if (useLLMDetection) {
      // Single LLM call that both detects language and generates the reply.
      const raw = await chatCompletion(
        [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: transcript },
        ],
        { maxTokens: 300, temperature: 0.3 }
      );

      // Parse: first line is the language code, rest is the summary.
      const lines = raw.split("\n");
      const langLine = lines[0].trim().toLowerCase();
      finalLang = ["en", "hi", "te"].includes(langLine) ? langLine : "en";
      reply = lines.slice(1).join("\n").trim();

      // Safety: if parsing failed and reply is empty, use the whole response.
      if (!reply) reply = raw.trim();
    } else {
      // Language already known — tell the LLM exactly what to reply in.
      const REPLY_RULES = {
        en: "Reply entirely in English.",
        hi: "Reply entirely in Hindi using Devanagari script only (e.g. मैं, पानी, खतरा). Never use romanized Hindi.",
        te: "Reply entirely in Telugu using Telugu script only (e.g. నేను, వరదలు, ప్రమాదం). Never use romanized Telugu.",
      };
      const directPrompt = `You are Flood Copilot, an AI voice assistant for flood emergencies.

LANGUAGE RULE (mandatory): ${REPLY_RULES[detectedLang] || REPLY_RULES.en}
Never mix languages in the same reply.

Focus on immediate safety: evacuation, shelter locations, emergency contacts (112, 1077, 108).
Preserve all emergency details: location, number of people, water level, urgency, hazards.
Maximum 3 sentences. Be calm and clear.`;

      reply = await chatCompletion(
        [
          { role: "system", content: directPrompt },
          { role: "user", content: transcript },
        ],
        { maxTokens: 256, temperature: 0.3 }
      );
      finalLang = detectedLang;
    }

    logger.info("[voice] Reply generated", { finalLang });
    ok(res, { reply, detectedLanguage: finalLang, timestamp: new Date().toISOString() });
  } catch (err) {
    if (isAiProviderError(err)) {
      logger.error(`[voice] AI provider error: ${err.status ?? ""} ${err.message}`);
      return fail(res, FRIENDLY.voice, aiHttpStatus(err));
    }
    next(err);
  }
}

module.exports = { postVoice };
