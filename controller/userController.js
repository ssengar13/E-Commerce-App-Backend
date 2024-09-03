const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(
    async(req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email: email});
        if(!findUser){
            // create new user
            const newUser = await User.create(req.body);
            res.json(newUser);
        } else {
            // User Already Exists
            // res.json({
            //     msg:"User Already Exists",
            //     success: false,
            // })
            throw new Error("User Alraedy Exists"); 
        }
    }
);

module.exports = { createUser };