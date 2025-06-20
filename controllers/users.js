const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/constants");

// GET /users

const getCurrentUser = (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Authorization required " });
  }
  return User.findById(req.user.id)
    .then((user) =>
      !user
        ? res.status(UNAUTHORIZED).json({ message: "User not found" })
        : res.status(200).json({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          })
    )
    .catch(() =>
      res.status(DEFAULT).json({ message: "Error from getCurrentUser" })
    );
};
// POST /users

const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;

  // Validate name
  if (typeof name !== "string" || name.length < 2) {
    return res.status(BAD_REQUEST).json({
      message: "Name must be at least 2 characters long",
    });
  }
  if (name.length > 30) {
    return res.status(BAD_REQUEST).json({
      message: "Name must be at most 30 characters long",
    });
  }

  // Validate avatar
  if (avatar && (typeof avatar !== "string" || !validator.isURL(avatar))) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Avatar must be a valid URL" });
  }

  // Validate email
  if (typeof email !== "string" || !validator.isEmail(email)) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email must be a valid email address" });
  }

  // Validate password
  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Password must be at least 8 characters long" });
  }

  // Check for duplicate email BEFORE hashing
  return User.findOne({ email })
    .then((existingUser) =>
      existingUser
        ? res.status(CONFLICT).json({ message: "Email already exists" })
        : bcrypt
            .hash(password, 10)
            .then((hash) =>
              User.create({ name, avatar, email, password: hash }).then(
                (user) =>
                  res.status(200).json({
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email,
                  })
              )
            )
            .catch((err) => {
              console.error(err);
              if (err.name === "ValidationError") {
                return res.status(BAD_REQUEST).json({ message: err.message });
              }
              return res
                .status(DEFAULT)
                .json({ message: "An error occurred on the server." });
            })
    )
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .json({ message: "An error occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Validate email format
  if (typeof email !== "string" || !validator.isEmail(email)) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email must be a valid email address" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch(() =>
      // authentication error
      res.status(UNAUTHORIZED).json({ message: "Invalid email or password " })
    );
};

// PATCH
const updateProfile = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
  }

  // Log incoming request data
  console.log("Request body:", req.body);

  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      const updatedUser = {
        id: user.id,
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
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .json({ message: "An error occurred on the server." });
    });
};
module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
