// Custom Error Classes for consistent error handling

class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.statusCode = 409;
    this.name = "ConflictError";
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
