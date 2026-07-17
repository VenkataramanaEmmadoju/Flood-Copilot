"use strict";
const { Router } = require("express");
const { body } = require("express-validator");
const { postChat } = require("../controllers/chatController");
const validate = require("../middleware/validate");

const router = Router();

router.post(
  "/",
  [
    body("message")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("message is required")
      .isLength({ max: 2000 })
      .withMessage("message must be under 2000 characters"),
    body("history")
      .optional()
      .isArray()
      .withMessage("history must be an array"),
  ],
  validate,
  postChat
);

module.exports = router;
