const router = require("express").Router();
const {
  storeItem,
  getCartItems,
  editItemInCart,
  deletCartItem,
} = require("../controllers/cart.controller");
const { requireUser } = require("../middlewares/authorization");

router.get("/cart", requireUser, getCartItems);
router.post("/cart", requireUser, storeItem);
router.put("/cart", requireUser, editItemInCart);
router.delete("/cart/:id", requireUser, deletCartItem);

module.exports = router;
