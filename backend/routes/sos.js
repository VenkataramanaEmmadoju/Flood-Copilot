"use strict";
const { Router } = require("express");
const { body } = require("express-validator");
const { postSos } = require("../controllers/sosController");
const validate = require("../middleware/validate");

const router = Router();

router.post(
  "/",
  [
    body("name")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("name is required")
      .isLength({ max: 100 })
      .withMessage("name must be under 100 characters"),
    body("location")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("location is required")
      .isLength({ max: 300 })
      .withMessage("location must be under 300 characters"),
    body("emergency")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("emergency description is required")
      .isLength({ max: 500 })
      .withMessage("emergency must be under 500 characters"),
    body("peopleAffected")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage("peopleAffected must be a number between 1 and 10000"),
    body("urgency")
      .optional()
      .isIn(["low", "medium", "high", "critical"])
      .withMessage("urgency must be one of: low, medium, high, critical"),
    body("contactNumber")
      .optional()
      .isString()
      .isLength({ max: 20 })
      .withMessage("contactNumber must be under 20 characters"),
  ],
  validate,
  postSos
);

module.exports = router;
