const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;
const errorHandler = require("./middlewares/errorHandler");

const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(cors());
app.use(express.json());

// 1. Request logger - logs all incoming requests (like front desk registering patients)
app.use(requestLogger);

// 2. 🏥 HOSPITAL ROUTES: All patient and medical services
app.use("/", mainRouter);

// 3. Error logger - logs any errors that occur (like emergency incident reports)
app.use(errorLogger);

// 4. 🚨 CELEBRATE ERROR HANDLER: Specialized validation error processor
// This processes validation errors from our intake forms before sending to ER
app.use(errors());

// 5. 🏥 CENTRALIZED ERROR HANDLER: The Emergency Room
// This handles all errors with professional medical communication
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
