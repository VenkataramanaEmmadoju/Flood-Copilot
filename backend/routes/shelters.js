"use strict";
const { Router } = require("express");
const { getShelters } = require("../controllers/sheltersController");

const router = Router();

// GET /api/shelters?district=Warangal&status=open
router.get("/", getShelters);

module.exports = router;
