const logger = require("../utils/logger");
const tagService = require("../services/tag-service.js");

const createTag = async (req, res, next) => {
  try {
    const tag = await tagService.create(req.body);

    logger.info("Create tag successfully");

    return res.status(201).send({ tag });
  } catch (error) {
    console.log(error);
    logger.error("Error: create tag controller");

    next(error);
  }
};

const getTags = async (req, res) => {
  try {
    const { category = "" } = req.query;
    const tags = await tagService.getAll(category);

    logger.info("Get all tags successfully");

    return res.send({ data: tags });
  } catch (error) {
    console.log(error);
    logger.error("Error: get tag controller");
    next(error);
  }
};

const editTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await tagService.update(id, req.body);

    logger.info("Edit tag successfully");

    return res.send({ message: "Edit tag successfully", tag });
  } catch (error) {
    console.log(error);
    logger.error("Error: edit tag controller");
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    await tagService.destroy(id);
    logger.info("Delete tag successfully");

    return res.send({ message: "Delete tag successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Error: Delete tag controller");
    next(error);
  }
};
module.exports = { createTag, getTags, editTag, deleteTag };
