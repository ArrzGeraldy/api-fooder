const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: [4, "username at least 4 character"],
      maxLength: [100, "username max length 100 character"],
      required: true,
    },

    email: {
      type: String,
      minLength: [4, "email at least 4 character"],
      maxLength: [100, "email max length 100 character"],
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: [3, "password at least 3 character"],
      maxLength: [100, "password max length 100 character"],
      required: true,
    },

    refreshToken: {
      type: String,
      default: "",
    },

    address: {
      type: String,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
