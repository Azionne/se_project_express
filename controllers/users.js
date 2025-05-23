const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error from getUsers", err });
    });
};

const getCurrentUser = (req, res) =>
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((e) =>
      res.status(500).send({ message: "Error from getCurrentUser", e })
    );

// POST /users

const createUser = (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  const { name, avatar, password, email } = req.body;

  // Validate the name field
  if (!name || name.length < 2 || name.length > 30) {
    return res
      .status(400)
      .json({ message: "Name must be between 2 and 30 characters long" });
  }

  // Validate the avatar field (optional or must be a valid URL if provided)
  if (avatar && !validator.isURL(avatar)) {
    return res.status(400).json({ message: "Avatar must be a valid URL" });
  }

  // Validate the email field
  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Email must be a valid email address" });
  }

  // Validate the password field
  if (!password || password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      // Respond with 201 and include all form data except password
      res.status(201).json({
        _id: userObj._id,
        name: userObj.name,
        avatar: userObj.avatar,
        email: userObj.email,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "An error occurred on the server." });
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

// PATCH
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server." });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  getUserById,
  login,
  updateProfile,
};
