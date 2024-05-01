const Category = require("../models/category.model");

const insertCategoryToDb = async (payload) => {
  return await Category.create(payload);
};

const getCategoriesFromDb = async () => {
  return await Category.find();
};

const findCategoryByName = async (name) => {
  return await Category.findOne({
    name: { $regex: name, $options: "i" },
  }).select("_id name");
};

const deleteCategoryFromDb = async (id) => {
  return await Category.findByIdAndDelete(id);
};

const updateCategoryFromDb = async (id, payload) => {
  return await Category.findOneAndUpdate(
    { _id: id },
    { name: payload },
    { new: true }
  );
};
module.exports = {
  insertCategoryToDb,
  getCategoriesFromDb,
  updateCategoryFromDb,
  deleteCategoryFromDb,
  findCategoryByName,
};
