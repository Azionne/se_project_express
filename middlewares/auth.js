const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/constants");

module.exports = (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  // Check for token in Authorization header
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }

  // If no token in header, check for token in query parameters
  if (!token && req.query.token) {
    token = req.query.token;
  }

  // If no token in query, check for token in request body
  if (!token && req.body.token) {
    token = req.body.token;
  }

  console.log("Token:", token);

  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Authorization required " });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Add user payload to request
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization required" }); // <-- use .json()
  }
};
