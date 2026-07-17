"use strict";
const { Router } = require("express");
const { getTips } = require("../controllers/tipsController");

const router = Router();

// GET /api/tips?category=evacuation&priority=critical
router.get("/", getTips);

module.exports = router;
