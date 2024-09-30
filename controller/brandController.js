const Brand = require("../models/brandModal");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Create a Brand
const createBrand = asyncHandler(async(req, res) => {
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    }catch(error) {
        throw new Error(error);
    }
});

//Update a Brand
const updateBrand = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedBrand);
    }catch(error) {
        throw new Error(error);
    }
})

//Delete a Brand
const deleteBrand = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete({ _id: id });
        res.json(deletedBrand);
    }catch(error) {
        throw new Error(error);
    }
})

//Get a Brand
const getBrand = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const fetchBrand = await Brand.findById(id);
        res.json(fetchBrand);
    }catch(error) {
        throw new Error(error);
    }
});

//Get all Brand
const getAllBrand = asyncHandler(async(req, res) => {
    try{
        const fetchAllBrand = await Brand.find();
        res.json(fetchAllBrand);
    }catch(error) {
        throw new Error(error);
    }
});


module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand};