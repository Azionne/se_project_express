const express = require("express");

const router = express.Router();
const {
  getCurrentUser,

  updateProfile,
} = require("../controllers/users");

const auth = require("../middlewares/auth");

// Get current user logged in
router.get("/me", auth, getCurrentUser);

// Update current logged in profile

const { validateUserProfileUpdate } = require("../middlewares/validation");

router.patch("/me", auth, validateUserProfileUpdate, updateProfile);

module.exports = router;
