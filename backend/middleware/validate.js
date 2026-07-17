"use strict";
const { validationResult } = require("express-validator");

/**
 * Runs after express-validator chains.
 * Returns 422 with field-level errors if validation fails.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        message: "Validation failed",
        fields: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      },
    });
  }
  next();
}

module.exports = validate;
