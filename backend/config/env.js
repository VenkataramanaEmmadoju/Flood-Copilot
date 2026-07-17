"use strict";
require("dotenv").config();

const isTest = process.env.NODE_ENV === "test";
const required = ["GROQ_API_KEY"];

for (const key of required) {
  if (!process.env[key] && !isTest) {
    console.error(`[config] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: (process.env.NODE_ENV || "development") === "development",

  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    modelVision: process.env.GROQ_VISION_MODEL || "llama-3.2-11b-vision-preview",
  },

  cors: {
    // In dev allow all. In prod set CORS_ORIGINS to comma-separated frontend URLs.
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
      : ["http://localhost:3000", "http://localhost:5000", "http://localhost:5173", "http://localhost:4173"],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  upload: {
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
    dir: process.env.UPLOAD_DIR || "uploads",
  },
};
