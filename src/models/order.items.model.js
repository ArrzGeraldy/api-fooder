const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
  },
  amount: {
    type: Number,
  },
});

const orderItems = mongoose.model("order_item", orderItemsSchema);

module.exports = orderItems;
