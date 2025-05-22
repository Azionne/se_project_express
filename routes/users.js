const express = require("express");
const router = express.Router();
const {
  login,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const clothingItem = require("./clothingItem");
const auth = require("../middlewares/auth");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);

// Protect all routes below this line
router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
