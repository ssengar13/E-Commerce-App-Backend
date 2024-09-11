const express = require("express");
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct } = require("../controller/productController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// router.route("/").post(createProduct).get(getAllProduct);
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/all-product", getAllProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/:id", getaProduct);

module.exports = router;