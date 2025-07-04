// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error to console as requested
  console.error("Error occurred:", err);

  // Default error status and message
  let statusCode = 500; // Default to 500 for unforeseen errors
  let message = "Internal Server Error";

  // Handle custom error classes first (these have statusCode property)
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle specific Mongoose/MongoDB error types
  else if (err.name === "ValidationError") {
    // Mongoose validation errors
    statusCode = 400;
    message = "Invalid data provided";
  } else if (err.name === "CastError") {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = "Duplicate data - resource already exists";
  } else if (err.name === "JsonWebTokenError") {
    // JWT authentication errors
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    // Expired JWT token
    statusCode = 401;
    message = "Token expired";
  }

  // Send error response with correct status code
  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;
