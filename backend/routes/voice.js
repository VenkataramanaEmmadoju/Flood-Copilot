"use strict";
const { Router } = require("express");
const { body } = require("express-validator");
const { postVoice } = require("../controllers/voiceController");
const validate = require("../middleware/validate");

const router = Router();

router.post(
  "/",
  [
    body("transcript")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("transcript is required")
      .isLength({ max: 5000 })
      .withMessage("transcript must be under 5000 characters"),
    body("language")
      .optional()
      .isIn(["auto", "te", "en", "hi"])
      .withMessage("language must be one of: auto, te, en, hi"),
  ],
  validate,
  postVoice
);

module.exports = router;
