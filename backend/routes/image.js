"use strict";
const { Router } = require("express");
const { postImage } = require("../controllers/imageController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = Router();

// POST /api/image  — multipart/form-data with field "image"
router.post("/", uploadMiddleware.single("image"), postImage);

module.exports = router;
