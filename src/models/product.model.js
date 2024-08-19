const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
      minLength: 4,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
      minLength: 4,
    },

    description: {
      type: String,
      maxLength: 1000,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    image_url: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag",
      },
    ],
  },

  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
