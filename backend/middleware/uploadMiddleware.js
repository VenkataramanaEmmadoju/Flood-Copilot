"use strict";
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { upload } = require("../config/env");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, upload.dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, and GIF images are accepted."), false);
  }
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: upload.maxFileSizeMb * 1024 * 1024 },
});

module.exports = uploadMiddleware;
