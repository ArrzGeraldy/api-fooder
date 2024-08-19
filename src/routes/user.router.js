const router = require("express").Router();
const { getUsers, deleteUser } = require("../controllers/user.controller");
const { requireUser, requireAdmin } = require("../middlewares/authorization");

router.get("/users", requireAdmin, getUsers);
router.delete("/users/:id", requireAdmin, deleteUser);

module.exports = router;
