const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      maxLength: [100],
      minLength: [3],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model("tag", tagSchema);

module.exports = Tag;
