const validator = require("validator");
const User = require("../models/user");

// GET /users
const getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users)) // Simplified return
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message }); // Explicit return
    });
};

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

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server." }); // Explicit return
    });
};

module.exports = { getUser, createUser };
