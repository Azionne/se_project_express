const express = require("express");
const {
  updateProfile,
  getCurrentUser,
  createUser,
  getUserById,
} = require("../controllers/users");

const router = express.Router();

module.exports = router;
router.get("/me", getCurrentUser);
router.patch("/me/update", updateProfile);
router.get("/:id", getUserById);
