const logger = require("../utils/logger");
const userService = require("../services/userService");

const registerController = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    res.status(200).json({
      data: {
        username: result.username,
        email: result.email,
      },
    });
  } catch (error) {
    console.log(error);
    logger.error("Error register controller");
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, userInfo } = await userService.login(
      req.body
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.send({ data: { user: userInfo, accessToken } });
  } catch (error) {
    console.log(error);
    logger.error("Error: login controller");
    next(error);
  }
};

const refreshController = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.token) return res.sendStatus(401);

    const refreshToken = cookies.token;
    const { accessToken, userInfo } = await userService.refreshToken(
      refreshToken
    );

    logger.info("Refresh token successfully");
    return res.send({ data: { user: userInfo, accessToken } });
  } catch (error) {
    console.log(error);
    logger.error("Error: refresh token controller");
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.token) return res.sendStatus(204);

    const token = cookies.token;

    const { success, cleared } = await userService.logout(token);

    if (success) {
      res.clearCookie("token");
      if (cleared) {
        return res.send({ message: "Success logout" });
      }
    }

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    logger.error("Error: logout controller");
    next(error);
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
