"use strict";
const { Router } = require("express");
const { getEmergency } = require("../controllers/emergencyController");

const router = Router();

// GET /api/emergency?type=flood
router.get("/", getEmergency);

module.exports = router;
