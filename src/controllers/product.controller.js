const { findCategoryByName } = require("../services/category-service");
const deleteImage = require("../utils/deleteImage");
const slugify = require("slugify");
const {
  addProductToDb,
  getProductsFromDb,
  getProductSize,
  findProduct,
  deletProductFromDb,
} = require("../services/product-service");
const { findTagsByName } = require("../services/tag-service");
const logger = require("../utils/logger");
const { responseError } = require("../utils/response");
const {
  createProductValidation,
} = require("../validations/product.validation");

const createProduct = async (req, res) => {
  try {
    const { error, value } = createProductValidation(req.body);

    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const existingProduct = await findProduct({ name: value.name });

    if (existingProduct) {
      deleteImage(req.file.filename);
      return responseError(res, 400, "Product name already exists");
    }

    if (!req.file) {
      return responseError(res, 400, "Image required");
    }

    const category = await findCategoryByName(value.category);
    value.category = category._id;
    const tags = await findTagsByName(value.tags);
    value.tags = tags.map((tag) => tag._id);

    value.slug = slugify(value.name, { lower: true });

    value.image_url = req.file.destination + "/" + req.file.filename;
    const products = await addProductToDb(value);

    logger.info("create product successfully");

    return res.status(201).send({ data: products });
  } catch (error) {
    console.log(error);
    deleteImage(req.file.filename);

    logger.error("Error create product controller");
    return responseError(res, 500, "Internal server error");
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    let { q = "", category = "", tags = [], sort = -1 } = req.query;

    let criteria = {};

    if (q.length >= 3)
      criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };

    if (category.length >= 3) {
      category = await findCategoryByName(category);

      if (category) criteria = { ...criteria, category: category._id };
    }

    if (tags.length >= 1) {
      tags = await findTagsByName(tags.map((tag) => tag));
      if (tags.length >= 1) {
        criteria = { ...criteria, tags: { $in: tags.map((tag) => tag._id) } };
      }
    }

    const productSize = await getProductSize(criteria);
    const totalPage = Math.ceil(productSize / limit);

    if (page > totalPage)
      return res.status(404).send({
        pagination: {
          current_page: page,
          per_page: limit,
          total_page: totalPage,
        },
        message: "Product not found",
        data: [],
      });
    const products = await getProductsFromDb(
      page,
      limit,
      criteria,
      Number(sort)
    );

    return res.send({
      pagination: {
        current_page: page,
        per_page: limit,
        total_page: totalPage,
      },
      data: products,
    });
  } catch (error) {
    console.log(error);

    logger.error("Error get products controller");
    return responseError(res, 500, "Internal server error");
  }
};

const getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await findProduct({ slug });
    if (!product) return responseError(res, 404, "Not found product");
    return res.send({ data: product });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

const editProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await deletProductFromDb(id);

    if (!product) {
      logger.error("Product not found");
      return responseError(res, 404, "Product not found");
    }
    const filename = product.image_url.split("/")[1];
    deleteImage(filename);
    logger.info("Delete product successfully");
    return res.send({ message: "Delete product successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Error delete product controller");
    return responseError(res, 500, "Internall server error");
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
};
