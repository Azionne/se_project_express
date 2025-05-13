const express = require("express"); // this imports express into app.js
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express(); //sets up server
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}); //specific port receiving request

app.use((req, res, next) => {
  req.user = {
    _id: "682255cb2a5cc9620dd1e058",
  };
  next();
  module.exports.createClothingItem = (req, res) => {
    console.log(req.user._id); // _id will become accessible
  };
});
