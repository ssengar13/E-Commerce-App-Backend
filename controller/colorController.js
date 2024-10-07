const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Create a Color
const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.json(newColor);
    } catch (error) {
        throw new Error(error);
    }
});

//Update a Color
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedColor = await Color.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedColor);
    } catch (error) {
        throw new Error(error);
    }
})

//Delete a Color
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedColor = await Color.findByIdAndDelete({ _id: id });
        res.json(deletedColor);
    } catch (error) {
        throw new Error(error);
    }
})

//Get a Color
const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const fetchColor = await Color.findById(id);
        res.json(fetchColor);
    } catch (error) {
        throw new Error(error);
    }
});

//Get all Color
const getAllColor = asyncHandler(async (req, res) => {
    try {
        const fetchAllColor = await Color.find();
        res.json(fetchAllColor);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createColor, updateColor, deleteColor, getColor, getAllColor };