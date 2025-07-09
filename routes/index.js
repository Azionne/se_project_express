const express = require("express");
const { NotFoundError } = require("../utils/errors");
const router = express.Router();
const { login, createUser } = require("../controllers/users");
const usersRoute = require("./users");
const clothingItem = require("./clothingItem");
const {
  validateUserInfo,
  validateUserAuth,
} = require("../middlewares/validation");

const auth = require("../middlewares/auth");

// Root path - requires auth to check authentication works
router.get("/", auth, (req, res) => {
  res.send({ message: "Authentication successful" });
});

// Public routes
router.post("/signin", validateUserAuth, login);
router.post("/signup", validateUserInfo, createUser);
router.use("/items", clothingItem);
router.use("/users", usersRoute);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
