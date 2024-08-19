const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["waiting payment", "processing", "in delivery", "success"],
      default: "waiting payment",
    },

    delivery_fee: {
      type: Number,
      default: 0,
    },

    delivery_address: {
      name: { type: String },
      phone: { type: String },
      province: { type: String },
      city: { type: String },
      detail: { type: String },
    },

    total: {
      type: Number,
    },
    snap_token: {
      type: String,
      default: "",
    },

    user: {
      userId: String,
      email: String,
      username: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
