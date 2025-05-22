const validator = require("validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs");

// GET /users
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((e) =>
      res.status(500).send({ message: "Error from getCurrentUser", e })
    );
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;

  // Validate the name field
  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return res
      .status(400)
      .send({ message: "Name must be between 2 and 30 characters long" });
  }

  // Validate the email field
  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .send({ message: "Email must be a valid email address" });
  }

  // Validate the avatar field only if provided
  if (avatar && !validator.isURL(avatar)) {
    res.status(400).send({ message: "Avatar must be a valid URL" });
    return;
  }

  // Validate the password field
  if (!password || password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password must be at least 8 characters long" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, password: hash, email }))
    .then((user) => {
      // Respond with the user's _id, name, and avatar
      res.status(201).json({ _id: user._id, name, avatar, email });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.code === 11000) {
        // Duplicate email error
        return res.status(409).send({ message: "Email already exists" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Incorrect email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send({ message: "Incorrect email or password" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        // Invalid ObjectId format
        return res.status(400).send({ message: "Invalid user ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        // Valid ObjectId, but not found in DB
        return res.status(404).send({ message: "User not found" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server." });
    });
};

//PATCH
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true, // return the updated document
      runValidators: true, // enable schema validation
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: "Error from updateProfile", err });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  getUserById,
  login,
  updateProfile,
};
