const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express(); // Initialize the app
const { PORT = 3001 } = process.env;

app.use(express.json()); // Middleware to parse JSON
app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use((req, _response, next) => {
  req.user = {
    _id: "682255cb2a5cc9620dd1e058",
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}); // specific port receiving request
app.use(cors());
