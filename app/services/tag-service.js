const Tag = require("../models/tag.model");

const findTagByName = async (name) => {
  return await Tag.findOne({ name });
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

module.exports = { findTagByName, updateTag, findTagsByName, findTagById };
