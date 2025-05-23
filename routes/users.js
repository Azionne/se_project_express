const express = require("express");
const router = express.Router();
const {
  createUser,
  getCurrentUser,
  getUserById,
  updateProfile,
} = require("../controllers/users");

// Public signup route
router.post("/", createUser);

// Get user by id
router.get("/:id", getUserById);

// Get current user logged in
router.get("/me", getCurrentUser);

// Update current logged in profile
router.patch("/me", updateProfile);

module.exports = router;
