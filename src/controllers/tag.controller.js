const Tag = require("../models/tag.model");
const logger = require("../utils/logger");
const { responseError } = require("../utils/response");
const {
  findTagByName,
  updateTag,
  findTagById,
} = require("../services/tag-service");
const {
  createTagValidation,
  updateTagValidation,
} = require("../validations/tag.validation");
const { findCategoryByName } = require("../services/category-service");
const tagService = require("../services/tag-service.js");

const createTag = async (req, res, next) => {
  try {
    const tag = await tagService.create(req.body);

    logger.info("Create tag successfully");

    return res.status(201).send({ tag });
  } catch (error) {
    console.log(error);
    logger.error("Error: create tag controller");

    next(e);
  }
};

const getTags = async (req, res) => {
  try {
    const { category = "" } = req.query;
    let filter = {};
    if (category.length) {
      const existsCategory = await findCategoryByName(category);

      if (existsCategory) {
        filter = { ...filter, category: existsCategory._id };
      } else {
        return responseError(res, 404, "Category not found");
      }
    }

    const tags = await Tag.find(filter).populate("category", "_id name");

    logger.info("Get all tags successfully");

    return res.send({ data: tags });
  } catch (error) {
    console.log(error);
    logger.error("Error: get tag controller");
    return responseError(res, 500, "Internal server error");
  }
};

const editTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateTagValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const foundTag = await findTagById(id);

    if (foundTag.name !== value.name) {
      const existingTag = await findTagByName(value.name);
      if (existingTag)
        return responseError(res, 400, "Tag name already exists");
    }

    const tag = await updateTag(id, value);

    if (!tag) {
      logger.info("Tag not found");

      return res.status(404).send({ message: "Tag not found", tag });
    }

    logger.info("Edit tag successfully");

    return res.send({ message: "Edit tag successfully", tag });
  } catch (error) {
    console.log(error);
    logger.error("Error: edit tag controller");
    return responseError(res, 500, "Internal server error");
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      logger.info("Tag not found");

      return res.status(404).send({ message: "Tag not found" });
    }

    logger.info("Delete tag successfully");

    return res.send({ message: "Delete tag successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Error: Delete tag controller");
    return responseError(res, 500, "Internal server error");
  }
};
module.exports = { createTag, getTags, editTag, deleteTag };
