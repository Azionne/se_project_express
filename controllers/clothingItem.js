const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
  UNAUTHORIZED,
} = require("../utils/constants");

// Ensure authentication middleware is used before these controllers in your route definitions
const createItem = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
  }
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).json(item))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: e.message });
      }
      return res.status(DEFAULT).json({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) =>
      res.status(DEFAULT).send({ message: "Error from getItems", e })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN)
          .json({ message: "Forbidden: You can only delete your own items" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send({ data: deletedItem })
      );
    })
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from deleteItem", e });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID 1" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((e) =>
      res.status(DEFAULT).send({ message: "Error from dislikeItem", e })
    );
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((e) =>
      res.status(DEFAULT).send({ message: "Error from dislikeItem", e })
    );
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
