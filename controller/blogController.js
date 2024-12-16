const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

// Create a Blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});


//Update a blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//Fetch a Single Blog
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findBlog = await Blog.findById({ _id: id }).populate("likes").populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate({ _id: id },
            {
                $inc: { numViews: 1 },
            },
            {
                new: true,
            }
        )
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//Fetch All Blog
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const findAllBlogs = await Blog.find();
        res.json(findAllBlogs);
    } catch (error) {
        throw new Error(error);
    }
});


//Delete a blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete({ _id: id });
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//Like in a blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find((userId => userId?.toString() === loginUserId?.toString()));
    if (alreadyDisliked) {
        const blogDislike = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, {
            new: true
        }
        );
        res.json(blogDislike);
    }
    if (isLiked) {
        const blogLike = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, {
            new: true
        }
        );
        res.json(blogLike);
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        }, {
            new: true
        }
        );
        res.json(blog);
    }
});

//Dislike the Blog
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find((userId => userId?.toString() === loginUserId?.toString()));
    if (alreadyLiked) {
        const blogLike = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, {
            new: true
        }
        );
        res.json(blogLike);
    }
    if (isDisliked) {
        const blogDislike = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, {
            new: true
        }
        );
        res.json(blogDislike);
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        }, {
            new: true
        }
        );
        res.json(blog);
    }
});


const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }

        const newBlog = await Blog.findByIdAndUpdate(
            { _id: id },
            {
                images: urls,
            },
            {
                new: true,
            }
        );

        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages };