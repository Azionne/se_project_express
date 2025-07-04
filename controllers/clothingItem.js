const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
  UNAUTHORIZED,
} = require("../utils/constants");

// Ensure authentication middleware is used before these controllers in your route definitions
const createItem = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new UnauthorizedError("Authorization required"));
  }
  const { name, weather, imageUrl } = req.body;
  const owner = req.user.id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err); // Let middleware handle other errors
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next); // Let middleware handle errors
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("The id string is in an invalid format"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      if (item.owner.toString() !== req.user.id.toString()) {
        return next(new ForbiddenError("You can only delete your own items"));
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send({ data: deletedItem })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("The id string is in an invalid format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("The id string is in an invalid format"));
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
