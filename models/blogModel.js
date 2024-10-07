const mongoose = require('mongoose'); 
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes:[{ type: ObjectId, ref:"User"}],
    dislikes:[{ type: ObjectId, ref:"User"}],
    author:{
        type: String,
        default: "Admin",
    },
    images: [],
},{
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);