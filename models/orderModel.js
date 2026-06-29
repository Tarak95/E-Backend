const mongoose = require('mongoose')
const { Schema } = mongoose

const orderModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [{
        title: String,
        price: Number,
        discountPrice: Number,
        sku: String,
        stock: Number,
        category: String,
        tag: [
            {
                type: String
            }
        ],
        status: String,
        images: [String],
        quantity: Number,
        totalPrice: Number
    }],

    totalPrice: {
        type: Number,
        required: true
    },

    tranid: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        enum: ['pending', 'reject', 'approved'],
        default: 'pending'
    }

}, { timestamps: true })

module.exports = mongoose.model('Order', orderModel)