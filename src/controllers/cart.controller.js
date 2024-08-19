const { findCartUser } = require("../services/cart-service");
const { findUserByEmail } = require("../services/userService");
const { responseError } = require("../utils/response");
const logger = require("../utils/logger");

const data = [
  {
    name: "Product 1",
    quantity: 12,
  },
  {
    name: "Me Product",
    quantity: 14,
  },
  {
    name: "Product Cart",
    quantity: 77,
  },
];

const test = async (req, res) => {
  res.send({ data: data });
};

const Cart = require("../models/cart.model");
const { findProduct } = require("../services/product-service");
const { storeCartItemValidation } = require("../validations/cart.validation");

const storeItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const { error, value } = storeCartItemValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, error.details[0].message);
    }

    const user = req.user;

    if (!user) return res.sendStatus(401);

    const foundUser = await findUserByEmail(user.email);
    if (!foundUser) return res.sendStatus(403);

    const product = await findProduct({ _id: itemId });
    if (!product) return responseError(res, 404, "Product not found");

    const amount = product.price * quantity;

    const duplicate = await Cart.findOne({
      user: foundUser._id,
      product: product._id,
    });

    if (duplicate) {
      const newQty = duplicate.quantity + quantity;
      const newAmount = product.price * newQty;
      const updateDuplicate = await Cart.findOneAndUpdate(
        { user: foundUser._id, product: product._id },
        { $set: { quantity: newQty, amount: newAmount } },
        { new: true }
      );
      return res.send({ data: updateDuplicate });
    }

    const cartItem = await Cart.create({
      user: foundUser._id,
      product: product._id,
      quantity,
      amount,
    });

    return res.send({ data: cartItem });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, error);
  }
};

const getCartItems = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    const foundUser = await findUserByEmail(user.email);

    if (!foundUser) return res.sendStatus(401);

    const cartItems = await Cart.find({ user: foundUser._id }).populate(
      "product"
    );

    return res.send({ data: cartItems });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

const editItemInCart = async (req, res) => {
  try {
    const { quantity, productId, amount } = req.body;

    const user = req.user;
    const foundUser = await findUserByEmail(user.email);
    if (!foundUser) return res.sendStatus(403);

    const updateCart = await Cart.findOneAndUpdate(
      { user: foundUser._id, product: productId },
      { quantity, amount },
      { new: true }
    );

    const cartItems = await Cart.find({ user: foundUser._id }).populate(
      "product"
    );
    return res.send({ data: cartItems });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "internal server error");
  }
};

const deletCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;
    const foundUser = await findUserByEmail(user.email);
    if (!foundUser) return res.sendStatus(403);

    const deleteItem = await Cart.findOneAndDelete({
      user: foundUser._id,
      product: id,
    });
    if (!deleteItem) return responseError(res, 404, "Data not found");

    const cartItem = await Cart.find({ user: foundUser._id }).populate(
      "product"
    );

    return res.send({ data: cartItem });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

module.exports = {
  test,
  storeItem,
  getCartItems,
  editItemInCart,
  deletCartItem,
};
