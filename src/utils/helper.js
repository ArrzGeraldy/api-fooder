const Product = require("../models/product.model.js");
const Cart = require("../models/cart.model.js");

const findProduct = async (id) => {
  return Product.findOne({ _id: id });
};

const duplicateCartItem = async (userId, itemId) => {
  const count = await Cart.countDocuments({
    user: userId,
    product: itemId,
  });

  if (count == 1) return true;
  return false;
};

module.exports = {
  findProduct,
  duplicateCartItem,
};
