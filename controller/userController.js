const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, 
        {
           refreshToken: refreshToken,
        }, 
        {
           new : true
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000,  
        })
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

// Handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) {
        throw new Error("There is no Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new Error("No Refresh Token Present in DB or Not Matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with Refresh Token");
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
    // res.json(user);
});

//Logout Functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    // Find the user with the refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // No content
    }
    // Clear the refresh token in the user's document
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    // Clear the cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // No content
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


//Update the password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  });

module.exports = { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateUser, blockAUser, unblockAUser, handleRefreshToken, logout, updatePassword };