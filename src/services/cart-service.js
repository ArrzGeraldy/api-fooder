const ResponseError = require("../error/response-error.js");
const Cart = require("../models/cart.model");
const userHelper = require("../utils/user-helper.js");
const { cartItemValidation } = require("../validations/cart.validation.js");
const validate = require("../validations/validate.js");
const helper = require("../utils/helper.js");

const findCartUser = async (user) => {
  return await Cart.findOne({ user });
};

const find = async (user) => {
  const foundUser = await userHelper.checkUser(user);

  return Cart.find({ user: foundUser._id }).populate("product");
};

const addItem = async (user, request) => {
  const foundUser = await userHelper.checkUser(user);
  const cartRequest = validate(cartItemValidation, request);

  const product = await helper.findProduct(cartRequest.itemId);

  if (!product) throw new ResponseError(404, "Product Not Found");

  const duplicate = await helper.duplicateCartItem(foundUser._id, product._id);

  if (duplicate) return update(user, request);

  const amount = product.price * cartRequest.quantity;

  return Cart.create({
    user: foundUser._id,
    product: product._id,
    amount,
    quantity: cartRequest.quantity,
  });
};

const update = async (user, request) => {
  const foundUser = await userHelper.checkUser(user);
  const cartRequest = validate(cartItemValidation, request);

  const product = await helper.findProduct(cartRequest.itemId);

  if (!product) throw new ResponseError(404, "Product Not Found");

  const foundItem = await Cart.findOne({
    user: foundUser._id,
    product: product._id,
  });

  if (!foundItem) throw new ResponseError(404, "Item Not Found");

  const newQty = foundItem.quantity + cartRequest.quantity;
  const newAmount = newQty * product.price;

  return Cart.findOneAndUpdate(
    { user: foundUser._id, product: product._id },
    { $set: { quantity: newQty, amount: newAmount } },
    { new: true }
  );
};

const destroy = async (id, user) => {
  foundUser = await userHelper.checkUser(user);
  const deleteItem = await Cart.findOneAndDelete({
    user: foundUser._id,
    product: id,
  });
  if (!deleteItem) throw new ResponseError(400, "Failed Delete Item");
};

module.exports = { findCartUser, find, destroy, addItem, update };
