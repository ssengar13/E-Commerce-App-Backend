const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    brand:{
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold:{
        type: Number,
        default: 0,
        // select: false,     this is for if we want to hide this from user
    },
    images: {
        type: Array,
    },
    color:{
        type: String,
        required:true ,
    },
    ratings:[
        {
            star: Number,
            postedBy: {
                type: ObjectId,
                ref: "User"
            },

        },
    ],
},
{
timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);