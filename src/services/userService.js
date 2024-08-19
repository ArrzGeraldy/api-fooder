const { ResponseError } = require("../error/response-error");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const { validate } = require("../validations/validate.js");
const User = require("../models/user.model");
const Cart = require("../models/cart.model.js");
const AddressDelivery = require("../models/addressDelivery.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { accessTokenSecret, refreshTokenSecret } = require("../configs/config");

const getAllUsers = async () => {
  return await User.find().select(["email", "username", "role", "createdAt"]);
};

const destroy = async (id) => {
  const user = await User.findOneAndDelete({ _id: id });

  if (!user) throw new ResponseError(404, "not found");

  await AddressDelivery.deleteMany({ user: id });
  await Cart.deleteMany({ user: id });

  return user;
};

const register = async (request) => {
  const user = validate(registerValidation, request);

  const countUser = await User.countDocuments({ email: request.email });

  if (countUser == 1) {
    throw new ResponseError(400, "email already exists");
  }
  user.password = bcrypt.hashSync(user.password, 10);

  return User.create(user);
};

const login = async (request) => {
  const loginRequest = validate(loginValidation, request);

  const user = await User.findOne({ email: loginRequest.email });

  if (!user) throw new ResponseError(400, "invalid username or password");

  const validPassword = bcrypt.compareSync(
    loginRequest.password,
    user.password
  );

  if (!validPassword)
    throw new ResponseError(400, "invalid username or password");

  const userInfo = {
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(userInfo, accessTokenSecret, {
    expiresIn: "2h",
  });

  const refreshToken = jwt.sign(userInfo, refreshTokenSecret, {
    expiresIn: "1d",
  });

  await User.findOneAndUpdate({ email: user.email }, { refreshToken });

  return {
    accessToken,
    refreshToken,
    userInfo,
  };
};

const refreshToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ refreshToken: token });

      if (!user) {
        return reject(new ResponseError(401, "Unauthorized"));
      }

      jwt.verify(token, refreshTokenSecret, (err, decoded) => {
        if (err) {
          return reject(new ResponseError(403, "Forbidden"));
        }

        const userInfo = {
          username: user.username,
          email: user.email,
          role: user.role,
        };

        const accessToken = jwt.sign(userInfo, accessTokenSecret, {
          expiresIn: "2h",
        });

        resolve({ accessToken, userInfo });
      });
    } catch (err) {
      reject(err);
    }
  });
};

const logout = async (token) => {
  try {
    const foundUser = await User.findOne({ refreshToken: token });

    if (!foundUser) {
      throw new ResponseError(403, "forbidden");
    }

    await User.findOneAndUpdate(
      { _id: foundUser._id },
      { $unset: { refreshToken: "" } }
    );

    return { success: true, cleared: true };
  } catch (error) {
    throw new ResponseError(500, "Error during logout");
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
  refreshToken,
  logout,
  destroy,
};
