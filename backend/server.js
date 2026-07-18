"use strict";
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const http = require("http");

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
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, same-origin SSR)
      if (!origin) return cb(null, true);
      if (config.isDev) return cb(null, true);
      if (config.cors.origins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin '${origin}' not allowed`));
    },
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
app.use("/api/alerts",    require("./routes/alerts"));
app.use("/api/chat",      require("./routes/chat"));
app.use("/api/voice",     require("./routes/voice"));
app.use("/api/image",     require("./routes/image"));
app.use("/api/translate", require("./routes/translate"));
app.use("/api/sos",       require("./routes/sos"));

// ── Production: serve built frontend + proxy SSR to nitro ────────────────────
if (!config.isDev) {
  // Serve Vite/TanStack Start static assets (JS, CSS, images, manifest, etc.)
  app.use(express.static(path.join(__dirname, "../.output/public")));

  // Catch-all: proxy all non-API requests to the TanStack Start SSR server
  // (nitro node server running on NITRO_PORT, default 3001)
  const NITRO_PORT = parseInt(process.env.NITRO_PORT, 10) || 3001;
  app.use((req, res) => {
    const options = {
      hostname: "127.0.0.1",
      port: NITRO_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `127.0.0.1:${NITRO_PORT}` },
    };
    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    proxy.on("error", (err) => {
      logger.error("SSR proxy error", { message: err.message });
      if (!res.headersSent) res.status(502).json({ error: "SSR unavailable" });
    });
    if (req.method !== "GET" && req.method !== "HEAD") {
      req.pipe(proxy, { end: true });
    } else {
      proxy.end();
    }
  });
}

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
      "GET  /api/alerts",
      "POST /api/chat",
      "POST /api/voice",
      "POST /api/image",
      "POST /api/translate",
      "POST /api/sos",
    ],
  });
});

module.exports = app;
