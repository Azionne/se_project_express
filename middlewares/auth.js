const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED, FORBIDDEN } = require("../utils/constants");

module.exports = (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  } else {
    token = req.cookies.jwt;
  }

  console.log("Token:", token); // <-- Debugging line

  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Authorization required " }); // <-- use .json()
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Add user payload to request
    return next();
  } catch (err) {
    return res.status(FORBIDDEN).json({ message: "Authorization required" }); // <-- use .json()
  }
};
