const router = require("express").Router();
const {
  getTags,
  createTag,
  editTag,
  deleteTag,
} = require("../controllers/tag.controller");
const { requireAdmin } = require("../middlewares/authorization");

router.get("/tags", getTags);
router.post("/tags", requireAdmin, createTag);
router.put("/tags/:id", requireAdmin, editTag);
router.delete("/tags/:id", requireAdmin, deleteTag);

module.exports = router;
