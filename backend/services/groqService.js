"use strict";
const groqClient = require("../config/groq");
const { groq } = require("../config/env");

/**
 * Send a chat completion to Groq and return the assistant's text.
 * @param {Array<{role: string, content: string}>} messages
 * @param {object} [opts]
 * @param {string} [opts.model]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.temperature]
 * @returns {Promise<string>}
 */
async function chatCompletion(messages, opts = {}) {
  const completion = await groqClient.chat.completions.create({
    model: opts.model || groq.model,
    messages,
    max_tokens: opts.maxTokens || 512,
    temperature: opts.temperature ?? 0.7,
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

/**
 * Send a vision-capable prompt (text + base64 image) to Groq.
 * @param {string} imageBase64  Base-64 encoded image (no data-URI prefix).
 * @param {string} mimeType     e.g. "image/jpeg"
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function visionCompletion(imageBase64, mimeType, prompt) {
  const completion = await groqClient.chat.completions.create({
    model: groq.modelVision,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
    max_tokens: 768,
    temperature: 0.4,
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

module.exports = { chatCompletion, visionCompletion };
