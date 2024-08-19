const { ResponseError } = require("../error/response-error.js");
const Tag = require("../models/tag.model");
const { validate } = require("../validations/validate.js");
const findTagByName = async (name) => {
  return await Tag.findOne({ name });
};

const create = async (request) => {
  const tagRequest = validate(request);
  const count = await Tag.findOne({ name: tagRequest.name });

  if (count == 1) throw new ResponseError(400, "name already exits");

  return Tag.create(tagRequest);
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
  findTagByName,
  updateTag,
  findTagsByName,
  findTagById,
  create,
};
