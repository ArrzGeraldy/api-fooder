const deleteImage = require("../utils/deleteImage");
const logger = require("../utils/logger");
const productService = require("../services/product-service.js");

const createProduct = async (req, res, next) => {
  try {
    const products = await productService.create(req.body, req.file);

    return res.status(201).send({ data: products });
  } catch (error) {
    console.log(error);
    if (req.file) deleteImage(req.file.filename);

    logger.error("Error create product controller");
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getByQuery(req.query);

    return res.send(products);
  } catch (error) {
    console.log(error);

    logger.error("Error get products controller");
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.destroy(id);

    logger.info("Delete product successfully");

    return res.send({ message: "Delete product successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Error delete product controller");
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  // getProduct,
  editProduct,
  deleteProduct,
};
