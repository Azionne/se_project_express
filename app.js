const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const userRoutes = require("./routes/users");
//const itemRoutes = require("./routes/items");

const app = express(); // Initialize the app
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json()); // Middleware to parse JSON
//app.use("/items", itemRoutes);
app.use((req, _response, next) => {
  req.user = {
    _id: "682255cb2a5cc9620dd1e058",
  };
  next();
});

// Define routes

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}); // specific port receiving request
