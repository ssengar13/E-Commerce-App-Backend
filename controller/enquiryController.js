const Enquiry = require("../models/enquiryModal");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Create a Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

//Update a Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedEnquiry);
    } catch (error) {
        throw new Error(error);
    }
})

//Delete a Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete({ _id: id });
        res.json(deletedEnquiry);
    } catch (error) {
        throw new Error(error);
    }
})

//Get a Enquiry
const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const fetchEnquiry = await Enquiry.findById(id);
        res.json(fetchEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

//Get all Enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const fetchAllEnquiry = await Enquiry.find();
        res.json(fetchAllEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquiry };