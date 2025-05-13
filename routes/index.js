const express = require("express");
const clothingItem = require("./clothingItem");
const router = express.Router();
const usersRoute = require("./users");

router.use("/items", clothingItem);
router.use("/users", usersRoute);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
