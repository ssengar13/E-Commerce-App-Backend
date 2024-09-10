const express = require("express");
const { createProduct, getaProduct, getAllProduct } = require("../controller/productController");
const router = express.Router();

// router.route("/").post(createProduct).get(getAllProduct);
router.post("/", createProduct);
router.get("/all-product", getAllProduct);
router.get("/:id", getaProduct);

module.exports = router;