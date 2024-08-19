const ResponseError = require("../error/response-error.js");
const Tag = require("../models/tag.model");
const Category = require("../models/category.model");
const { tagValidation } = require("../validations/tag.validation.js");
const validate = require("../validations/validate.js");

const getAll = async (category) => {
  let filter = {};

  if (category.length) {
    const foundCategory = await Category.findOne({
      name: { $regex: category, $options: "i" },
    }).select("_id name");

    if (foundCategory) {
      filter = { ...filter, category: foundCategory._id };
    } else {
      throw new ResponseError(404, "category not found");
    }
  }

  return Tag.find(filter).populate("category", "_id name");
};
const create = async (request) => {
  const tagRequest = validate(tagValidation, request);
  const count = await Tag.countDocuments({ name: tagRequest.name });

  if (count == 1) throw new ResponseError(400, "name already exits");

  return Tag.create(tagRequest);
};

const update = async (id, request) => {
  const count = await Tag.countDocuments({ _id: id });
  console.log({ count });

  if (count < 1) throw new ResponseError(404, "tag not found");

  const tagRequest = validate(tagValidation, request);
  return Tag.findByIdAndUpdate(id, tagRequest, { new: true });
};

const destroy = async (id) => {
  const tag = await Tag.findByIdAndDelete(id);

  if (!tag) throw new ResponseError(404, "tag not found");
};

const findTagById = async (id) => {
  return await Tag.findOne({ _id: id });
};

const updateTag = async (id, payload) => {
  return await Tag.findByIdAndUpdate(id, payload, { new: true });
};

const findTagsByName = async (payload) => {
  return await Tag.find({ name: { $in: payload } }).select("_id name");
};

module.exports = {
  updateTag,
  findTagsByName,
  findTagById,
  create,
  update,
  destroy,
  getAll,
};
