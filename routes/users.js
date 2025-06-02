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
router.patch("/me", auth, updateProfile);

module.exports = router;
