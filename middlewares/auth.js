const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  // Try to get token from Authorization header
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  } else if (req.cookies && req.cookies.jwt) {
    // Try to get token from cookies
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).send({ message: "Authorization required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Add user payload to request
    return next();
  } catch (err) {
    return res.status(401).send({ message: "Authorization required" });
  }
};
