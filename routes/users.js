const express = require("express");
const {
  updateProfile,
  getCurrentUser,
  createUser,
  getUserById,
} = require("../controllers/users");

const router = express.Router();

module.exports = router;
