const mongoose = require("mongoose");

const addressDeliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },

    detail: {
      type: String,
    },
  },
  { timestamps: true }
);

const AddressDelivery = mongoose.model(
  "address_delivery",
  addressDeliverySchema
);

module.exports = AddressDelivery;
