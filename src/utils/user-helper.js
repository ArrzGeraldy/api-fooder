const ResponseError = require("../error/response-error");
const User = require("../models/user.model");

const checkUser = async (user) => {
  const foundUser = await User.findOne({ email: user.email });

  if (!foundUser) throw new ResponseError(404, "User Not Found.");

  return foundUser;
};

module.exports = {
  checkUser,
};
