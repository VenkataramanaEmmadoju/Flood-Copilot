"use strict";
const { ok } = require("../utils/respond");
const shelters = require("../data/shelters");

function getShelters(req, res) {
  const { district, status } = req.query;
  let result = shelters;
  if (district) result = result.filter((s) => s.district.toLowerCase() === district.toLowerCase());
  if (status) result = result.filter((s) => s.status === status);
  ok(res, { count: result.length, shelters: result });
}

module.exports = { getShelters };
