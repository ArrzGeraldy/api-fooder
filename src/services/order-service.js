const Order = require("../models/order.model.js");
const OrderItems = require("../models/order.items.model.js");
const ResponseError = require("../error/response-error");
const User = require("../models/user.model.js");
const userHelper = require("../utils/user-helper.js");

const findOne = async (id, user) => {
  const order = await Order.findOne({ _id: id });
  if (!order) throw new ResponseError(404, "Order not found");
  const foundUser = await User.findOne({ email: user.email });

  if (!foundUser) throw new ResponseError(404, "Order not found");

  if (
    String(order.user.userId) !== String(foundUser._id) &&
    foundUser.role !== "admin"
  ) {
    throw new ResponseError(403, "Forbidden");
  }

  const orderItems = await OrderItems.find({ orderId: order._id }).populate(
    "product"
  );

  return { order, orderItems };
};

const findByuser = async (user) => {
  const foundUser = await User.findOne({ email: user.email });

  if (!foundUser) throw new ResponseError(404, "Order not found");

  const order = await Order.find({ "user.userId": foundUser._id });

  if (!order) throw new ResponseError(404, "Order not found");

  return order;
};

const findAll = async (query) => {
  const { q = "", status = "", sort = -1 } = query;
  let criteria = {};

  if (q) {
    criteria = { ...criteria, _id: q };
  }

  if (status.length > 2) {
    criteria = { ...criteria, status };
  }

  return Order.find(criteria).sort({
    createdAt: parseInt(sort),
  });
};

const update = async (id, status) => {
  try {
    return Order.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    throw new ResponseError(500, "Error updating order");
  }
};

module.exports = {
  findOne,
  findByuser,
  findAll,
  update,
};
