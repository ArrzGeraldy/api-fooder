const Cart = require("../models/cart.model");

const findCartUser = async (user) => {
  return await Cart.findOne({ user });
};

module.exports = { findCartUser };
