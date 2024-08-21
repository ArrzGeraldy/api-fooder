const express = require("express");
const registerRoutes = require("../routes");
const setupMiddleware = require("../middlewares");
const errorMiddleware = require("../middlewares/error-middleware");

const app = express();

setupMiddleware(app);

registerRoutes(app);

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).send("not found");
});

module.exports = { app };
