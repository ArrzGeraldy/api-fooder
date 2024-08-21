const ResponseError = require("../error/response-error.js");
const Category = require("../models/category.model");
const { categoryValidation } = require("../validations/category.validation");
const validate = require("../validations/validate.js");
const helper = require("../utils/helper.js");

const create = async (request) => {
  const categoryRequest = validate(categoryValidation, request);

  if (await helper.countCategory(categoryRequest.name))
    throw new ResponseError(400, "Category name already exists");

  return Category.create(categoryRequest);
};

const update = async (id, request) => {
  const categoryRequest = validate(categoryValidation, request);

  if (await helper.countCategory(categoryRequest.name))
    throw new ResponseError(400, "Category name already exists");

  const updateCategory = await Category.findOneAndUpdate(
    { _id: id },
    { name: categoryRequest.name },
    { new: true }
  );

  if (!updateCategory) throw new ResponseError(404, "Category not found");

  return updateCategory;
};

const destroy = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ResponseError(404, "Category not found");
};

const getAll = async () => {
  return Category.find();
};

module.exports = {
  getAll,
  create,
  update,
  destroy,
};
