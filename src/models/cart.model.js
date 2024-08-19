const mongoose = require("mongoose");

const cartItemsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  amount: {
    type: Number,
  },
});

cartItemsSchema.index({ user: 1, product: 1 }, { unique: true });

const Cart = mongoose.model("cart_item", cartItemsSchema);

module.exports = Cart;
