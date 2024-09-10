const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");


//Create a Product
const createProduct = asyncHandler(async(req, res) => {
    try{
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
});

//Get a Product
const getaProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }catch (error){
        throw new Error(error);
    }
});

//Get All Products
const getAllProduct = asyncHandler(async(req, res) => {
    try{
        const allProducts = await Product.find();
        res.json(allProducts);
    }catch(error) {
        throw new Error(error);
    }
});



module.exports = { createProduct, getaProduct, getAllProduct };
