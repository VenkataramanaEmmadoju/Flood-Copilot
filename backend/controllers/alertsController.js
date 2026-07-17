"use strict";
const { ok } = require("../utils/respond");
const alerts = require("../data/alerts");

const SEVERITY_ORDER = ["critical", "high", "moderate", "advisory"];

function getAlerts(req, res) {
  const { district, severity } = req.query;

  let result = [...alerts];
  if (district) result = result.filter((a) => a.district.toLowerCase() === district.toLowerCase());
  if (severity) result = result.filter((a) => a.severity === severity);

  // Sort by severity then recency
  result.sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  ok(res, { count: result.length, alerts: result });
}

module.exports = { getAlerts };
