const {
  findUserByEmail,
  insertUserToDatabase,
  updateTokenUser,
} = require("../services/userService");
const { responseError } = require("../utils/response");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const { accessTokenSecret, refreshTokenSecret } = require("../configs/config");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// expire token
const exipred = "2h";

// register
const registerController = async (req, res) => {
  try {
    const { error, value } = registerValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const existingUser = await findUserByEmail(value.email);

    if (existingUser)
      return responseError(res, 400, `Email already exists`, false);

    value.password = bcrypt.hashSync(value.password, 10);

    logger.info("Register user succesfully");
    await insertUserToDatabase(value);

    return res.status(201).send({ message: "Success register user" });
  } catch (error) {
    console.log(error);
    logger.error("Error register controller");
    return responseError(res, 500, `Internal server error`, false);
  }
};

// login
const loginController = async (req, res) => {
  try {
    const { error, value } = loginValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const existingUser = await findUserByEmail(value.email);

    if (!existingUser)
      return responseError(res, 400, `Invalid email or password`, false);

    const validPassword = bcrypt.compareSync(
      value.password,
      existingUser.password
    );

    if (!validPassword)
      return responseError(res, 400, `Invalid email or password`, false);

    const userInfo = {
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = jwt.sign(userInfo, accessTokenSecret, {
      expiresIn: exipred,
    });

    const refreshToken = jwt.sign(userInfo, refreshTokenSecret, {
      expiresIn: "1d",
    });

    await updateTokenUser(value.email, refreshToken);

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info("User login successfully");
    return res.send({ data: { user: userInfo, accessToken } });
  } catch (error) {
    console.log(error);
    logger.error("Error: login controller");
    return responseError(res, 500, `Internal server error`, false);
  }
};

// refresh token
const refreshController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.token) return res.sendStatus(401);

    const refreshToken = cookies.token;
    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) return res.sendStatus(401);

    jwt.verify(refreshToken, refreshTokenSecret, (error, decoded) => {
      if (error) return res.sendStatus(403);

      const userInfo = {
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      };

      const accessToken = jwt.sign(userInfo, accessTokenSecret, {
        expiresIn: exipred,
      });

      logger.info("Refresh token successfully");
      return res.send({ data: { user: userInfo, accessToken } });
    });
  } catch (error) {
    console.log(error);
    logger.error("Error: refresh token controller");
    return responseError(res, 500, "Internal server error", false);
  }
};

// logout
const logoutController = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.token) return res.sendStatus(204);

    const token = cookies.token;

    const foundUser = await User.findOne({ refreshToken: token });

    if (!foundUser) {
      res.clearCookie("token", {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.sendStatus(204);
    }

    await User.findOneAndUpdate(
      { _id: foundUser._id },
      { $unset: { refreshToken: "" } }
    );

    res.clearCookie("token");

    return res.send({ message: "succes logout" });
  } catch (error) {
    console.log(error);
    logger.error("Error: logout controller");
    return responseError(res, 500, "Internal server error", false);
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
