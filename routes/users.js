const express = require("express");
const { getUser, createUser, getUserById } = require("../controllers/users");

const router = express.Router();

// Define the routes
router.get("/", getUser); // Matches GET /users
router.post("/", createUser); // Matches POST /users
router.get("/:id", getUserById); // Matches GET /users/:id
module.exports = router;
