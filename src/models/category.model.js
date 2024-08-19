const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      maxLength: [100],
      minLength: [3],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
