"use strict";
const { chatCompletion } = require("../services/groqService");
const { ok } = require("../utils/respond");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

async function postSos(req, res, next) {
  try {
    const {
      name,
      location,
      emergency,
      peopleAffected = 1,
      urgency = "high",
      contactNumber = "",
    } = req.body;

    logger.info("[sos] Generating SOS message", { name, location, urgency, peopleAffected });

    const prompt = `Generate a bilingual SOS distress message for a flood emergency.

Details:
- Name: ${name}
- Location: ${location}
- Emergency: ${emergency}
- People affected: ${peopleAffected}
- Urgency level: ${urgency}
- Contact number: ${contactNumber || "not provided"}

Create a structured SOS in this JSON format:
{
  "englishMessage": "...",
  "teluguMessage": "...",
  "smsText": "Short SMS under 160 chars for relay to 112",
  "broadcastMessage": "Radio/announcement version"
}

The English and Telugu messages should be clear, professional, and include all details.
The SOS should ask for immediate rescue and include the location prominently.`;

    const messages = [
      {
        role: "system",
        content:
          "You are an emergency communications specialist. Generate accurate, urgent SOS messages for flood victims in Telangana. Always include location, people count, and urgency. Return valid JSON only.",
      },
      { role: "user", content: prompt },
    ];

    const raw = await chatCompletion(messages, { maxTokens: 768, temperature: 0.3 });

    let sosContent;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      sosContent = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      sosContent = {};
    }

    // Fallback if model doesn't return proper JSON
    if (!sosContent.englishMessage) {
      sosContent.englishMessage = `🆘 SOS — FLOOD EMERGENCY\nName: ${name}\nLocation: ${location}\nSituation: ${emergency}\nPeople affected: ${peopleAffected}\nUrgency: ${urgency.toUpperCase()}\nContact: ${contactNumber || "N/A"}\nPlease send rescue immediately. Call 112.`;
    }
    if (!sosContent.teluguMessage) {
      sosContent.teluguMessage = `🆘 అత్యవసర సహాయం కావాలి — వరద అత్యవసరం\nపేరు: ${name}\nస్థానం: ${location}\nపరిస్థితి: ${emergency}\nప్రభావితులు: ${peopleAffected}\nవెంటనే సహాయం పంపండి. 112 కి కాల్ చేయండి.`;
    }

    ok(res, {
      sosId: uuidv4(),
      ...sosContent,
      metadata: {
        name,
        location,
        emergency,
        peopleAffected,
        urgency,
        contactNumber,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postSos };
