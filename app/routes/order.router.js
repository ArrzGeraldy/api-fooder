const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  paymentSuccess,
  getUserOrders,
  getAllOrders,
  updateOrder,
} = require("../controllers/order.controller");
const { requireUser, requireAdmin } = require("../middlewares/authorization");

router.get("/admin/orders", requireAdmin, getAllOrders);
router.put("/admin/orders/:id", requireAdmin, updateOrder);
router.get("/orders", requireUser, getUserOrders);
router.get("/orders/:id", requireUser, getOrderById);
router.post("/orders", requireUser, createOrder);
router.post("/orders/payment", requireUser, paymentSuccess);

module.exports = router;
