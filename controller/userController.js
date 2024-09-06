const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

// Create a User
const createUser = asyncHandler(
    async(req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email: email});
        if(!findUser){
            // create new user
            const newUser = await User.create(req.body);
            res.json(newUser);
        } else {
            // res.json({
            //     msg:"User Already Exists",
            //     success: false,
            // })
            throw new Error("User Alraedy Exists"); 
        }
    }
);


//Login a User
const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // console.log(email, password);
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)){
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token:generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});

//Update a User

const updateUser = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(_id, 
            {
                firstname: req?.body.firstname,
                lastname: req?.body.lastname,
                email: req?.body.email,
                mobile: req?.body.mobile,
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    }catch (error){
        throw new Error(error);
    }
});

//Get all Users
const getAllUser = asyncHandler(async (req, res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

//Get a single User

const getAUser =  asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getUser = await User.findById(id);
        res.json({getUser});
    }catch(error) {
        throw new Error(error);
    }
});


//Delete a single User

const deleteAUser =  asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({deleteUser});
    }catch(error) {
        throw new Error(error);
    }
});


//Block a User

const blockAUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const blockUser = await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockUser);
    }catch (error){
        throw new Error(error);
    }
});

//Unblock a User

const unblockAUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblockUser = await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Unblocked",
        });
    }catch (error){
        throw new Error(error);
    }
});

module.exports = { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateUser, blockAUser, unblockAUser};