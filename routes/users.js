const express = require("express");
const { getUser, createUser } = require("../controllers/users");

const router = express.Router();

// Define the routes
router.get("/", getUser); // Matches GET /users
router.post("/", createUser); // Matches POST /users

module.exports = router;
