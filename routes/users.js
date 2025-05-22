const express = require("express");
const {
  updateProfile,
  getCurrentUser,
  createUser,
  getUserById,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

// Signup route (no auth)
router.post("/", createUser);

// Protected routes
router.get("/me", auth, getCurrentUser);
router.patch("/me/update", auth, updateProfile);
router.get("/:id", auth, getUserById);

module.exports = router;
