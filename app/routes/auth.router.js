const router = require("express").Router();
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
} = require("../controllers/auth.controller");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshController);
router.delete("/logout", logoutController);

module.exports = router;
