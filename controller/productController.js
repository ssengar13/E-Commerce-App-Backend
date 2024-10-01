const { query } = require("express");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

//Create a Product
const createProduct = asyncHandler(async(req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
});

//Get a Product
const getaProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }catch (error){
        throw new Error(error);
    }
});

//Get All Products
const getAllProduct = asyncHandler(async(req, res) => {
    try{
        // const allProducts = await Product.find({
        //     brand: req.query.brand,
        //     category: req.query.category,
        //     color: req.query.color,
        // });


        //Filtering
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        // console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(JSON.parse(queryStr));
        
        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = queru.sort(sortBy);
        }else{
            query = query.sort("-createdAt");
        }

        //limiting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if (skip >= productCount){
                throw new Error("This Page does not exists");
            }
        }
        // console.log(page, limit, skip);

        const product = await query;
        // const allProducts = await Product.find(queryObj);
        res.json(product);
    }catch(error) {
        throw new Error(error);
    }
});

//Update a Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the id from req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//Delete a Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the id from req.params
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: id });
        res.json(deletedProduct);
    } catch (error) {
        throw new Error(error);
    }
});


//Add to wishlist
const addToWishlist = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, 
                {
                $pull : { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id, 
                {
                $push : { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    }catch (error) {
        throw new Error (error);
    }
});

//Rating a product
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user; // User's ID
    const { star, prodId, comment} = req.body; // Rating and Product ID

    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has already rated the product
        let alreadyRated = product.ratings.find(
            (rating) => rating.postedBy.toString() === _id.toString()
        );

        if (alreadyRated) {
            // Update the existing rating using positional $ operator
            await Product.updateOne(
                { _id: prodId, "ratings.postedBy": _id },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            // Add a new rating if the user has not rated yet
            await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: _id,
                        },
                    },
                },
                { new: true }
            );
        }

        // Recalculate the overall rating
        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        let ratingSum = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0); // Fix the reduce function

        let actualRating = Math.round(ratingSum / totalRating);

        let finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalRating: actualRating,
            },
            {
                new: true,
            }
        );

        res.json(finalProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // Validate the MongoDB ObjectId
  
    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
  
      // Iterate over each file and upload to Cloudinary
      for (const file of files) {
        const { path } = file; // Destructure the file path from each file
        const newPath = await uploader(path); // Upload to Cloudinary and get the URL
        urls.push(newPath); // Store the returned URL
        fs.unlinkSync(path);
      }
  
      // Update the product with the new image URLs
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        {
          images: urls, // Save the URLs in the images field
        },
        {
          new: true, // Return the updated document
        }
      );
  
      res.json(updatedProduct); // Return the updated product
    } catch (error) {
      throw new Error(error); // Pass the error to the async handler
    }
  });
  

module.exports = { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages };
