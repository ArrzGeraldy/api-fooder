const User = require("../models/user.model");

const getAllUsers = async () => {
  return await User.find().select(["email", "username", "role", "createdAt"]);
};
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const deleteUserFromDb = async (id) => {
  return await User.findOneAndDelete({ _id: id });
};

const insertUserToDatabase = async (payload) => {
  console.log({ payload });
  return await User.create(payload);
};

const updateTokenUser = async (email, refreshToken) => {
  return await User.findOneAndUpdate({ email: email }, { refreshToken });
};

module.exports = {
  findUserByEmail,
  insertUserToDatabase,
  updateTokenUser,
  getAllUsers,
  deleteUserFromDb,
};
