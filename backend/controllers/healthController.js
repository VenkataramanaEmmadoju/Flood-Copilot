"use strict";
const { ok } = require("../utils/respond");
const { nodeEnv } = require("../config/env");

function getHealth(req, res) {
  ok(res, {
    status: "ok",
    service: "flood-copilot-backend",
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
}

module.exports = { getHealth };
