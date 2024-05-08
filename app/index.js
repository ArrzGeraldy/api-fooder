require("./db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const verifyToken = require("./middlewares/verifyToken");
// router
const authRoute = require("./routes/auth.router");
const categoryRoute = require("./routes/category.router");
const tagRoute = require("./routes/tag.router");
const productRoute = require("./routes/product.router");
const cartRoute = require("./routes/cart.router");
const addressRoute = require("./routes/address.router");
const orderRoute = require("./routes/order.router");
const userRoute = require("./routes/user.router");
// const { EventEmitter } = require("stream");
// EventEmitter.setMaxListeners(15); // Atur batas maksimum listener menjadi 15

const app = express();
const PORT = 4000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fooder-pi.vercel.app",
      "https://fooder-git-master-arrzgeraldys-projects.vercel.app",
      "https://fooder-arrzgeraldys-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../images")));
app.use(verifyToken);

// routes api v1
app.use("/auth", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", tagRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", addressRoute);
app.use("/api/v1", orderRoute);

// catch
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

app.listen(PORT, () => {
  console.log("App running on port: ", PORT);
});
