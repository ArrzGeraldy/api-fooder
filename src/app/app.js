const express = require("express");
const registerRoutes = require("../routes");
const setupMiddleware = require("../middlewares");
const errorMiddleware = require("../middlewares/error-middleware");

const app = express();

setupMiddleware(app);

registerRoutes(app);

app.use(errorMiddleware);

app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code == "MIME TYPE") {
      return res.status(400).json({ error: err.field });
    } else if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: err.message });
    } else {
      return res.status(400).json({ error: err });
    }
  }
  res.status(500).json({ error: err });
});

app.use((req, res) => {
  res.status(404).send("not found");
});

module.exports = { app };
