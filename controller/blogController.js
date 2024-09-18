const Blog = require("../models/blogModal");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

// Create a Blog
const createBlog = asyncHandler(async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    }catch(error) {
        throw new Error(error);
    }
});


//Update a blog
const updateBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
     });
        res.json(updatedBlog);
    }catch(error) {
        throw new Error(error);
    }
});

//Fetch a Single Blog
const getBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const findBlog = await Blog.findById({ _id: id });
        const updateViews = await Blog.findByIdAndUpdate({ _id: id }, 
            {
                $inc: {numViews: 1},
            },
            {
                new: true,
            }
        )
        res.json(updateViews);
    }catch(error) {
        throw new Error(error);
    }
});

//Fetch All Blog
const getAllBlog = asyncHandler(async(req, res) => {
    try{
        const findAllBlogs = await Blog.find();
        res.json(findAllBlogs);
    }catch(error) {
        throw new Error(error);
    }
});


//Delete a blog
const deleteBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const deletedBlog = await Blog.findByIdAndDelete({ _id: id });
        res.json(deletedBlog);
    }catch(error) {
        throw new Error(error);
    }
});

module.exports = { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog };