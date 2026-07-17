"use strict";
const { isDev } = require("../config/env");

/**
 * Centralised error-handling middleware.
 * Must be registered last (after all routes).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log for ops visibility
  console.error(`[error] ${req.method} ${req.path} → ${status}: ${message}`);
  if (isDev && err.stack) console.error(err.stack);

  res.status(status).json({
    success: false,
    error: {
      message,
      ...(isDev && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;
