const validator = require("validator");
const User = require("../models/user");

// GET /users
const getUser = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users)) // Simplified return
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Validate the name field
  if (!name || name.length < 2 || name.length > 30) {
    return res
      .status(400)
      .send({ message: "Name must be between 2 and 30 characters long" });
  }

  // Validate the avatar field
  if (!avatar || !validator.isURL(avatar)) {
    return res.status(400).send({ message: "Avatar must be a valid URL" });
  }

  // Create the user
  return User.create({ name, avatar }) // Ensure return is present
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server." });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      // CastError: invalid ObjectId, DocumentNotFoundError: not found
      if (err.name === "CastError" || err.name === "DocumentNotFoundError") {
        return res.status(400).send({ message: "User not found" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server." });
    });
};
module.exports = { getUser, createUser, getUserById };
