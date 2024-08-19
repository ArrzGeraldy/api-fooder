const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const verifyToken = require("./verifyToken");
const path = require("path");

const setupMiddleware = (app) => {
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
  app.use("/images", express.static(path.join(__dirname, "../../images")));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(verifyToken);
};

module.exports = setupMiddleware;
