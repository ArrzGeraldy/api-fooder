const logger = require("../utils/logger");

const categoryService = require("../services/category-service.js");

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);

    logger.info("Create category successfully");

    return res.status(201).send({ category });
  } catch (error) {
    console.log(error);
    logger.error("Error: [create category controller");

    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();

    logger.info("Get all categories successfully");

    return res.send({ data: categories });
  } catch (error) {
    console.log(error);
    logger.error("Error: get category controller");
    next(error);
  }
};

const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryService.update(id, req.body);

    return res.send({ message: "Edit category successfully", category });
  } catch (error) {
    console.log(error);
    logger.error("Error: edit category controller");
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.destroy(id);

    return res.send({ message: "Delete category successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Error: Delete category controller");
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  editCategory,
  deleteCategory,
};
