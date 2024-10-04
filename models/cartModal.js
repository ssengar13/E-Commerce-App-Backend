const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product",
            },
            count : Number,
            color: String,
            price: Number,
        },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);