"use strict";
const { Router } = require("express");
const { getAlerts } = require("../controllers/alertsController");

const router = Router();

// GET /api/alerts?district=Warangal&severity=critical
router.get("/", getAlerts);

module.exports = router;
