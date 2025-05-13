const express = require("express");
const { getUser, createUser } = require("../controllers/users");

const router = express.Router();

router.get("/users", getUser); // Ensure getUser is a function
router.post("/users", createUser); // Ensure createUser is a function

module.exports = router;
