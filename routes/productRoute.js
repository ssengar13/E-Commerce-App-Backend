const express = require("express");
const { createProduct } = require("../controller/productController");
const router = express.Router();

router.post("/", createProduct);

module.exports = router;