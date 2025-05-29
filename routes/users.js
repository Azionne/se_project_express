const express = require("express");
const router = express.Router();
const {
  createUser,
  getCurrentUser,
  getUserById,
  updateProfile,
  getUsers,
} = require("../controllers/users");

const User = require("../models/user");
const auth = require("../middlewares/auth");

// Get current user logged in
router.get("/me", auth, getCurrentUser);

// Update current logged in profile
router.patch("/me", auth, updateProfile);

// Create a new user
router.post("/", auth, createUser);

module.exports = router;
