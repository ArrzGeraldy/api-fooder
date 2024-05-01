const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  paymentSuccess,
  getOrders,
} = require("../controllers/order.controller");
const { requireUser } = require("../middlewares/authorization");

router.get("/orders", requireUser, getOrders);
router.get("/orders/:id", requireUser, getOrderById);
router.post("/orders", requireUser, createOrder);
router.post("/orders/payment", requireUser, paymentSuccess);

module.exports = router;
