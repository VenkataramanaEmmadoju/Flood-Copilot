"use strict";
const fs = require("fs");
const path = require("path");
const { visionCompletion } = require("../services/groqService");
const { ok, fail } = require("../utils/respond");
const logger = require("../utils/logger");

const VISION_PROMPT = `You are a flood severity assessment expert. Analyse this image and provide:
1. SEVERITY: one of [minor, moderate, severe, critical]
2. WATER_LEVEL: estimated water depth (if visible)
3. IMMEDIATE_RISKS: list up to 3 specific dangers visible
4. RESCUE_ADVICE: 2-3 actionable rescue or evacuation instructions
5. EMERGENCY_SERVICES: whether to call 112 (yes/no and why)

Respond in this exact JSON structure:
{
  "severity": "...",
  "waterLevel": "...",
  "immediateRisks": ["...", "..."],
  "rescueAdvice": ["...", "..."],
  "callEmergency": true/false,
  "callEmergencyReason": "...",
  "summary": "One-sentence plain-language summary"
}`;

async function postImage(req, res, next) {
  let filePath;
  try {
    if (!req.file) return fail(res, "No image file uploaded.", 400);

    filePath = req.file.path;
    const mimeType = req.file.mimetype;

    logger.info("[image] Analysing uploaded image", { filename: req.file.filename, mimeType });

    const imageBase64 = fs.readFileSync(filePath).toString("base64");

    const rawResponse = await visionCompletion(imageBase64, mimeType, VISION_PROMPT);

    // Parse JSON from the model response
    let analysis;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: rawResponse };
    } catch {
      analysis = { summary: rawResponse };
    }

    ok(res, {
      analysis,
      imageId: path.basename(filePath),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  } finally {
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = { postImage };
