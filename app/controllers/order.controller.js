const Order = require("../models/order.model");
const { findUserByEmail } = require("../services/userService");
const { mtClientKey, mtServerKey } = require("../configs/config");
const { Types } = require("mongoose");
const midtransClient = require("midtrans-client");
const orderItems = require("../models/order.items.model");
const { responseError } = require("../utils/response");
const OrderItems = require("../models/order.items.model");

// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: `${mtServerKey}`,
  clientKey: `${mtClientKey}`,
});

const createOrder = async (req, res) => {
  try {
    const { address, items } = req.body;

    const user = req.user;
    const foundUser = await findUserByEmail(user.email);
    if (!foundUser) return res.sendStatus(403);

    let totalAmount = 0;

    items.forEach((item) => {
      totalAmount += item.amount;
    });

    let order = new Order({
      _id: new Types.ObjectId(),
      total: totalAmount,
      user: foundUser._id,
      delivery_address: {
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        detail: address.detail,
      },
    });

    let parameter = {
      transaction_details: {
        order_id: order._id,
        gross_amount: totalAmount,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    order.snap_token = token;

    await OrderItems.insertMany(
      items.map((item) => ({
        product: item.product._id,
        quantity: parseInt(item.quantity),
        amount: parseInt(item.amount),
        orderId: order._id,
      }))
    );
    await order.save();

    return res.send({ data: order });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "internal server error");
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;
    const order = await Order.findOne({ _id: id }).populate(
      "user",
      "username email role"
    );

    if (!order) return responseError(res, 404, "Order not found");

    const foundUser = await findUserByEmail(user.email);

    if (!foundUser || String(order.user._id) !== String(foundUser._id)) {
      return res.sendStatus(403);
    }

    const orderItems = await OrderItems.find({ orderId: order._id }).populate(
      "product",
      "-createdAt -updatedAt -__v -category -tags"
    );

    return res.send({ data: { order, orderItems } });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};
const getOrders = async (req, res) => {
  try {
    const user = req.user;
    const foundUser = await findUserByEmail(user.email);

    if (!foundUser) {
      return res.sendStatus(403);
    }
    const order = await Order.find({ user: foundUser._id });

    if (!order) return responseError(res, 404, "Order not found");

    return res.send({ data: order });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { result } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: result.order_id },
      { status: "processing" },
      { new: true }
    );

    return res.send({ message: "success" });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

module.exports = { createOrder, getOrderById, paymentSuccess, getOrders };
