const express = require("express");

const router = express.Router();
const { login, createUser } = require("../controllers/users");
const usersRoute = require("./users");
const clothingItem = require("./clothingItem");
const { NOT_FOUND } = require("../utils/constants");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);
router.use("/users", usersRoute);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
