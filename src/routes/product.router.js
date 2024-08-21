const router = require("express").Router();
const upload = require("../configs/multer");
const multer = require("multer");
const {
  createProduct,
  getProducts,
  editProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/product.controller");

router.post(
  "/upload",
  (req, res, next) => {
    // Middleware untuk menangani unggahan file
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Jika ada kesalahan, teruskan ke middleware error handling berikutnya
        console.log("error single");
        return next(err);
      }
      // Jika tidak ada kesalahan, lanjutkan ke controller
      next();
    });
  },
  (req, res) => {
    // Controller untuk menangani logika bisnis setelah unggahan file berhasil
    res.status(200).json({ message: "File uploaded successfully" });
  }
);

router.get("/products", getProducts);
router.post("/products", upload.single("image"), createProduct);
router.put("/products/:id", editProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
