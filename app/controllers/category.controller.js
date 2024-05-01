const {
  insertCategoryToDb,
  getCategoriesFromDb,
  updateCategoryFromDb,
  deleteCategoryFromDb,
  findCategoryByName,
} = require("../services/category-service");
const logger = require("../utils/logger");
const { responseError } = require("../utils/response");
const {
  createCategoryValidation,
} = require("../validations/category.validation");

const createCategory = async (req, res) => {
  try {
    const { error, value } = createCategoryValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const existingCategory = await findCategoryByName(value.name);

    if (existingCategory)
      return responseError(res, 400, "Category name already exists");

    const category = await insertCategoryToDb(value);

    logger.info("Create category successfully");

    return res.status(201).send({ category });
  } catch (error) {
    console.log(error);
    logger.error("Error: [create category controller");

    return responseError(res, 500, "Internal server error");
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesFromDb();

    logger.info("Get all categories successfully");

    return res.send({ data: categories });
  } catch (error) {
    console.log(error);
    logger.error("Error: get category controller");
    return responseError(res, 500, "Internal server error");
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = createCategoryValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const existingCategory = await findCategoryByName(value.name);

    if (existingCategory)
      return responseError(res, 400, "Category name already exists");

    const category = await updateCategoryFromDb(id, value.name);

    if (!category) {
      logger.info("Category not found");

      return res.status(404).send({ message: "Category not found", category });
    }

    logger.info("Edit category successfully");

    return res.send({ message: "Edit category successfully", category });
  } catch (error) {
    console.log(error);
    logger.error("Error: edit category controller");
    return responseError(res, 500, "Internal server error");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await deleteCategoryFromDb(id);

    if (!category) {
      logger.info("Category not found");

      return res.status(404).send({ message: "Category not found" });
    }

    logger.info("Delete category successfully");

    return res.send({ message: "Delete category successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Error: Delete category controller");
    return responseError(res, 500, "Internal server error");
  }
};

module.exports = {
  createCategory,
  getCategories,
  editCategory,
  deleteCategory,
};
