"use strict";
const { ok } = require("../utils/respond");
const emergencyContacts = require("../data/emergency");

function getEmergency(req, res) {
  const { type } = req.query;
  let result = emergencyContacts;
  if (type) result = result.filter((c) => c.type === type);
  ok(res, { count: result.length, contacts: result });
}

module.exports = { getEmergency };
