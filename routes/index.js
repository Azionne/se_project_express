const express = require("express");

const router = express.Router();
const {
  login,
  createUser,

  updateProfile,
} = require("../controllers/users");
const usersRoute = require("./users");
const clothingItem = require("./clothingItem");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);
router.use("/users", usersRoute);

// Protect all routes below this line

// Then define protected routes below

router.patch("/me", updateProfile);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
