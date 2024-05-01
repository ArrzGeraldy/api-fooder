const User = require("../models/user.model");

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const insertUserToDatabase = async (payload) => {
  console.log({ payload });
  return await User.create(payload);
};

const updateTokenUser = async (email, refreshToken) => {
  return await User.findOneAndUpdate({ email: email }, { refreshToken });
};

module.exports = { findUserByEmail, insertUserToDatabase, updateTokenUser };
