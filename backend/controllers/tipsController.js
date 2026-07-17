"use strict";
const { ok } = require("../utils/respond");
const tips = require("../data/tips");

function getTips(req, res) {
  const { category, priority } = req.query;
  let result = tips;
  if (category) result = result.filter((t) => t.category === category);
  if (priority) result = result.filter((t) => t.priority === priority);
  ok(res, { count: result.length, tips: result });
}

module.exports = { getTips };
