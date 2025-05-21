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
const auth = require("../middlewares/auth.js");
//const router = require("./routes/index");

router.use("/items", clothingItem);

// POST /signin and /signup handlers
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", usersRoute);
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);
router.use(auth);
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
