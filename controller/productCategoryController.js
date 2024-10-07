const Category = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Create a Category
const createCategory = asyncHandler(async(req, res) => {
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    }catch(error) {
        throw new Error(error);
    }
});

//Update a Category
const updateCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedCategory = await Category.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedCategory);
    }catch(error) {
        throw new Error(error);
    }
})

//Delete a Category
const deleteCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory = await Category.findByIdAndDelete({ _id: id });
        res.json(deletedCategory);
    }catch(error) {
        throw new Error(error);
    }
})

//Get a Category
const getCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const fetchCategory = await Category.findById(id);
        res.json(fetchCategory);
    }catch(error) {
        throw new Error(error);
    }
});

//Get all Category
const getAllCategory = asyncHandler(async(req, res) => {
    try{
        const fetchAllCategory = await Category.find();
        res.json(fetchAllCategory);
    }catch(error) {
        throw new Error(error);
    }
});


module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory};