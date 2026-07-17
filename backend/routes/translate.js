"use strict";
const { Router } = require("express");
const { body } = require("express-validator");
const { postTranslate } = require("../controllers/translateController");
const validate = require("../middleware/validate");

const router = Router();

router.post(
  "/",
  [
    body("text")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("text is required")
      .isLength({ max: 3000 })
      .withMessage("text must be under 3000 characters"),
    body("from")
      .optional()
      .isIn(["auto", "te", "en", "hi"])
      .withMessage("from must be one of: auto, te, en, hi"),
    body("to")
      .notEmpty()
      .withMessage("to language is required")
      .isIn(["te", "en", "hi"])
      .withMessage("to must be one of: te, en, hi"),
  ],
  validate,
  postTranslate
);

module.exports = router;
