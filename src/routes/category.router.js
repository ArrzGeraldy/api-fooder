const router = require("express").Router();
const {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { requireAdmin } = require("../middlewares/authorization");

// const { requireUser, requireAdmin } = require("../middlewares/authorization");

router.get("/categories", getCategories);
router.post("/categories", requireAdmin, createCategory);
router.put("/categories/:id", requireAdmin, editCategory);
router.delete("/categories/:id", requireAdmin, deleteCategory);

module.exports = router;
