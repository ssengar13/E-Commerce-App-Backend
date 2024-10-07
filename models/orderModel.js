const mongoose = require('mongoose'); 
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product",
            },
            count : Number,
            color: String,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"],
    },
    orderby: {
        type: ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);