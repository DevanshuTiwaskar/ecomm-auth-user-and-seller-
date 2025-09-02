const mongoose = require("mongoose");

// Mongoose Order Schema with Validation
const orderSchema = mongoose.Schema({
   orderId:{ 
    type: String,
    required: true
   },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0, // Non-negative value
    },
    address: {
        type: String,
        minlength:5,
        mixlength:255
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    payment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment",
        },
    ],
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "delivery",
    },
});

// Mongoose Model
const orderModel = mongoose.model("order", orderSchema);



module.exports =  orderModel;
