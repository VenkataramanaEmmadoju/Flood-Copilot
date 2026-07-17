"use strict";
const rateLimit = require("express-rate-limit");
const { rateLimit: cfg } = require("../config/env");

const limiter = rateLimit({
  windowMs: cfg.windowMs,
  max: cfg.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Too many requests. Please try again later." },
  },
});

module.exports = limiter;
