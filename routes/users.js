const express = require("express");
const router = express.Router();
const {
  login,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

// Public signup route
router.post("/", createUser);

// Get current user logged in
router.get("/me", getCurrentUser);

// Update current logged in profile
router.patch("/me", updateProfile);

module.exports = router;
