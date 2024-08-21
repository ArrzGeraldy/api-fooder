const Product = require("../models/product.model.js");
const Cart = require("../models/cart.model.js");
const Category = require("../models/category.model.js");

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

const countCategory = async (name) => {
  const count = await Category.countDocuments({
    name,
  });

  return count === 1;
};
const countProduct = async (name) => {
  const count = await Product.countDocuments({
    name,
  });

  return count === 1;
};

const findCategoryByName = async (name) => {
  return Category.findOne({
    name: { $regex: name, $options: "i" },
  }).select("_id name");
};

module.exports = {
  findProduct,
  duplicateCartItem,
  countCategory,
  countProduct,
  findCategoryByName,
};
