module.exports = (err, req, res, next) => {
  console.error(err); // Log the error for debugging
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });
};
