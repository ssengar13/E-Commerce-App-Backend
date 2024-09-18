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
    image:{
        type:String,
        default: "https://img.freepik.com/free-photo/teamwork-making-online-blog_53876-94868.jpg?w=826&t=st=1726639386~exp=1726639986~hmac=408b4ecd700a4bc8b79493e0928a984ab795909d7e0ba6145fc69334dabeff45"
    },
    author:{
        type: String,
        default: "Admin",
    }
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