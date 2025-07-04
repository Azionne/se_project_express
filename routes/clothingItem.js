const express = require("express");

const router = express.Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

// 🏥 HOSPITAL ANALOGY: Routes are like different hospital departments
// Each department requires proper paperwork (validation) before treatment

// Create new clothing item - requires auth and validation
// Like requiring both insurance card (auth) AND completed intake form (validation)
router.post("/", auth, validateClothingItem, createItem);

// Get all items - no auth needed (public viewing)
router.get("/", getItems);

// Delete item - requires auth and valid item ID
// Like requiring insurance AND valid patient ID to cancel appointment
router.delete("/:itemId", auth, validateId, deleteItem);

// Like item - requires auth and valid item ID
router.put("/:itemId/likes", auth, validateId, likeItem);

// Dislike item - requires auth and valid item ID
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
