"use strict";

/**
 * Uniform success envelope.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [status=200]
 */
function ok(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

/**
 * Uniform error envelope (for use inside controllers, not the central handler).
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [status=400]
 */
function fail(res, message, status = 400) {
  res.status(status).json({ success: false, error: { message } });
}

module.exports = { ok, fail };
