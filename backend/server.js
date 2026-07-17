"use strict";
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// Load & validate env first
const config = require("./config/env");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const rateLimiter = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// ── App ────────────────────────────────────────────────────────────────────────
const app = express();

// ── Uploads directory ─────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, config.upload.dir);
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.isDev
      ? true // allow all in dev
      : config.cors.origins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan(config.isDev ? "dev" : "combined"));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use("/api/", rateLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/health",    require("./routes/health"));
app.use("/api/tips",      require("./routes/tips"));
app.use("/api/shelters",  require("./routes/shelters"));
app.use("/api/emergency", require("./routes/emergency"));
app.use("/api/chat",      require("./routes/chat"));
app.use("/api/voice",     require("./routes/voice"));
app.use("/api/image",     require("./routes/image"));
app.use("/api/translate", require("./routes/translate"));
app.use("/api/sos",       require("./routes/sos"));

// ── 404 & Error handlers ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(config.port, "0.0.0.0", () => {
  logger.info(`Flood Copilot backend running`, {
    port: config.port,
    env: config.nodeEnv,
    endpoints: [
      "GET  /api/health",
      "GET  /api/tips",
      "GET  /api/shelters",
      "GET  /api/emergency",
      "POST /api/chat",
      "POST /api/voice",
      "POST /api/image",
      "POST /api/translate",
      "POST /api/sos",
    ],
  });
});

module.exports = app;
