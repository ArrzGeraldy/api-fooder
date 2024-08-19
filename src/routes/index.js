const authRoute = require("./auth.router");
const categoryRoute = require("./category.router");
const tagRoute = require("./tag.router");
const productRoute = require("./product.router");
const cartRoute = require("./cart.router");
const addressRoute = require("./address.router");
const orderRoute = require("./order.router");
const userRoute = require("./user.router");

const registerRoutes = (app) => {
  app.use("/auth", authRoute);
  app.use("/api/v1", userRoute);
  app.use("/api/v1", categoryRoute);
  app.use("/api/v1", tagRoute);
  app.use("/api/v1", productRoute);
  app.use("/api/v1", cartRoute);
  app.use("/api/v1", addressRoute);
  app.use("/api/v1", orderRoute);
};

module.exports = registerRoutes;
