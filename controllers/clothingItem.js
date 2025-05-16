const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");

//POST
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id; // Get owner from middleware

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).json(item))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: "Error from createItem", e });
    });
};

//GET
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => res.status(500).send({ message: "Error from getItems", e }));
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) =>
      res.status(500).send({ message: "Error from updateItem", e })
    );
};

//DELETE
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({ message: "Item not found" });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(400).json({ message: "Item not found" });
      }
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

//PUT

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).json({ message: "Error from likeItem", e });
    });
};

//Disilike

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  // Validate itemId before querying the database
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from dislikeItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
