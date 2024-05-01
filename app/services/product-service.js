const Product = require("../models/product.model");

const addProductToDb = async (payload) => {
  return await Product.create(payload);
};

const getProductSize = async (criteria) => {
  return await Product.find(criteria).countDocuments();
};

const getProductsFromDb = async (page, limit, criteria, sortBy) => {
  const skip = (page - 1) * limit;
  return await Product.find(criteria)
    .sort({ createdAt: sortBy })
    .skip(skip)
    .limit(limit)
    .populate("category", "_id name")
    .populate("tags", "_id name");
};

const findProduct = async (payload) => {
  return await Product.findOne(payload).populate("tags", "name");
};

const deletProductFromDb = async (id) => {
  return await Product.findOneAndDelete({ _id: id });
};

module.exports = {
  addProductToDb,
  getProductsFromDb,
  getProductSize,
  findProduct,
  deletProductFromDb,
};
