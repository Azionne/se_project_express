const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json({ data: users }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error from getUsers", err });
    });
};

const getCurrentUser = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Authorization required " });
  }
  console.log("req.user:", req.user);
  User.findById(req.user._id)
    .then((user) => {
      console.log("user from DB:", user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { _id, name, avatar, email } = user;
      return res.status(200).json({ _id, name, avatar, email });
    })
    .catch((e) =>
      res.status(500).json({ message: "Error from getCurrentUser", e })
    );
};
// POST /users

const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;

  // Validate name
  if (typeof name !== "string" || name.length < 2) {
    return res.status(400).json({
      message: "Name must be at least 2 characters long",
    });
  }
  if (name.length > 30) {
    return res.status(400).json({
      message: "Name must be at most 30 characters long",
    });
  }

  // Validate avatar
  if (avatar && (typeof avatar !== "string" || !validator.isURL(avatar))) {
    return res.status(400).json({ message: "Avatar must be a valid URL" });
  }

  // Validate email
  if (typeof email !== "string" || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Email must be a valid email address" });
  }

  // Validate password
  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  // Check for duplicate email BEFORE hashing
  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Only hash and create if all validation passes and email is unique
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        return User.create({ name, avatar, email, password: hash }).then(
          (user) => {
            res.status(200).json({
              _id: user._id,
              name: user.name,
              avatar: user.avatar,
              email: user.email,
            });
          }
        );
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "An error occurred on the server." });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  // Validate email format
  if (typeof email !== "string" || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Email must be a valid email address" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      // authentication error
      // If credentials are invalid, respond with 400
      res.status(401).json({ message: "Invalid email or password 1" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params; // <-- Fix: get id from req.params
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Only return the required fields
      const { _id, name, avatar, email } = user;
      return res.status(200).json({ _id, name, avatar, email });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // Invalid ObjectId format
        return res.status(400).json({ message: "Invalid user ID" });
      }
      return res
        .status(500)
        .json({ message: "An error occurred on the server." });
    });
};

// PATCH
const updateProfile = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Authorization required" });
  }

  // Log incoming request data
  console.log("Request body:", req.body);

  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      // Log outgoing response data
      console.log("Updated user:", updatedUser);
      return res.status(200).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "An error occurred on the server." });
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
