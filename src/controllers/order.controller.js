const Order = require("../models/order.model");
const { findUserByEmail } = require("../services/userService");
const { mtClientKey, mtServerKey } = require("../configs/config");
const { Types } = require("mongoose");
const midtransClient = require("midtrans-client");
const orderItems = require("../models/order.items.model");
const { responseError } = require("../utils/response");
const OrderItems = require("../models/order.items.model");
const orderService = require("../services/order-service.js");

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
    console.log({ foundUser });
    let totalAmount = 0;

    items.forEach((item) => {
      totalAmount += item.amount;
    });

    let order = new Order({
      _id: new Types.ObjectId(),
      total: totalAmount,
      user: {
        userId: String(foundUser._id),
        email: foundUser.email,
        username: foundUser.username,
      },
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

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { order, orderItems } = await orderService.findOne(id, req.user);

    return res.send({ data: { order, orderItems } });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const user = req.user;

    const order = await orderService.findByuser(user);

    return res.send({ data: order });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.findAll(req.query);
    return res.send({ data: orders });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const orders = await orderService.update(id, status);
    return res.send({ message: "update order success", data: orders });
  } catch (error) {
    console.log(error);
    next(error);
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

module.exports = {
  createOrder,
  getOrderById,
  paymentSuccess,
  getUserOrders,
  getAllOrders,
  updateOrder,
};
