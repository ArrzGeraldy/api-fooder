const mongoose = require("mongoose");
const config = require("../configs/config");
mongoose
  .connect(config.dbAtlas)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
