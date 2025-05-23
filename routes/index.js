const express = require("express");
const router = express.Router();
const {
  login,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const usersRoute = require("./users");
const clothingItem = require("./clothingItem");
const auth = require("../middlewares/auth");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);
router.use("/users", usersRoute);

// Protect all routes below this line

router.use(auth);

router.use((req, res, next) => {
  // Only set for protected routes
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

// Then define protected routes below
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
