const ResponseError = require("../error/response-error");
const Product = require("../models/product.model");
const deleteImage = require("../utils/deleteImage");
const { countProduct } = require("../utils/helper");
const { productValidation } = require("../validations/product.validation");
const validate = require("../validations/validate");
const Tag = require("../models/tag.model.js");
const slugify = require("slugify");
const helper = require("../utils/helper.js");

const create = async (request, file) => {
  if (!file) throw new ResponseError(400, "Image required");

  const productRequest = validate(productValidation, request);

  if (await countProduct(productRequest.name)) {
    throw new ResponseError(400, "Product name already exists");
  }

  const category = await helper.findCategoryByName(productRequest.category);

  productRequest.category = category;

  const tags = await Tag.find({ name: { $in: productRequest.tags } }).select(
    "_id name"
  );

  productRequest.tags = tags.map((tag) => tag._id);
  productRequest.slug = slugify(productRequest.name, { lower: true });
  productRequest.image_url = file.destination + "/" + file.filename;

  return Product.create(productRequest);
};

const getByQuery = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 2;
  let { q = "", category = "", tags = [], sort = -1 } = query;

  let criteria = {};

  if (q.length >= 3) {
    criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
  }

  if (category.length >= 3) {
    category = await helper.findCategoryByName(category);
    if (category) {
      criteria = { ...criteria, category: category._id };
    }
  }

  if (tags.length >= 1) {
    tags = await Tag.find({ name: { $in: tags.map((tag) => tag) } }).select(
      "_id name"
    );
    if (tags.length >= 1) {
      criteria = { ...criteria, tags: { $in: tags.map((tag) => tag._id) } };
    }
  }

  const productSize = await Product.find(criteria).countDocuments();
  const totalPage = Math.ceil(productSize / limit);

  if (page > totalPage)
    throw new ResponseError(400, "Page exceeds available limit.");

  const products = await getProductsFromDb(page, limit, criteria, Number(sort));

  return {
    pagination: {
      current_page: page,
      per_page: limit,
      total_page: totalPage,
    },
    data: products,
  };
};

const destroy = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) throw new ResponseError(404, "Product not found");
  const filename = product.image_url.split("/")[1];
  deleteImage(filename);
};

const getProductsFromDb = async (page, limit, criteria, sortBy) => {
  const skip = (page - 1) * limit;
  return await Product.find(criteria)
    .sort({ createdAt: sortBy })
    .skip(skip)
    .limit(limit)
    .populate("category", "_id name")
    .populate("tags", "_id name");
};

module.exports = {
  getProductsFromDb,
  create,
  getByQuery,
  destroy,
};
