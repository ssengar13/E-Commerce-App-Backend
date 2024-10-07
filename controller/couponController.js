const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");


//Create a Coupon
const createCoupon = asyncHandler(async(req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }catch (error) {
        throw new Error(error);
    }
});

//Get All Coupon
const getAllCoupon = asyncHandler(async(req, res) => {
    try{
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    }catch (error) {
        throw new Error(error);
    }
});

//Update Coupon
const updateCoupon = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
     });
        res.json(updatedCoupon);
    }catch (error) {
        throw new Error(error);
    }
});

//Delete Coupon
const deleteCoupon = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete({ _id: id });
        res.json(deletedCoupon);
    }catch (error) {
        throw new Error(error);
    }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon};