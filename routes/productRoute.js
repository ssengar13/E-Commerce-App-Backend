const express = require("express");
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating } = require("../controller/productController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const { uploadImages, deleteImages } = require("../controller/uploadController");

// router.route("/").post(createProduct).get(getAllProduct);
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/all-product", getAllProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/:id", getaProduct);

module.exports = router;