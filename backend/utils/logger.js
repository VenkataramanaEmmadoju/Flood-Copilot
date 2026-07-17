"use strict";
const { isDev } = require("../config/env");

const levels = { info: "INFO", warn: "WARN", error: "ERROR", debug: "DEBUG" };

function log(level, message, meta) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${levels[level]}] ${message}`;
  if (meta) {
    isDev ? console[level](line, meta) : console[level](line, JSON.stringify(meta));
  } else {
    console[level === "debug" ? "log" : level](line);
  }
}

const logger = {
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta),
  debug: (msg, meta) => isDev && log("debug", msg, meta),
};

module.exports = logger;
