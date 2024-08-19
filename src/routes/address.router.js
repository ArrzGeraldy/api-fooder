const router = require("express").Router();
const {
  createAddress,
  getAddressUser,
  editAddress,
  deleteAddress,
} = require("../controllers/addressDelivery.controller");
const { requireUser } = require("../middlewares/authorization");

router.get("/addresses", requireUser, getAddressUser);
router.post("/addresses", requireUser, createAddress);
router.put("/addresses/:id", requireUser, editAddress);
router.delete("/addresses/:id", requireUser, deleteAddress);

module.exports = router;
