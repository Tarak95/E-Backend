const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },

    description: {
        type: String,
    },

    additionalInfo: {
        type: String,
    },

    price: {
        type: Number,
        required: true
    },

    discountPrice: {
        type: Number,
        min: 0,
        default: 0
    },

    sku: {
        type: String,
        required: true,
        unique: true,
    },

    stock: {
        type: Number,
        min: 0,
        default: 0
    },

    brand: {
        type: String,
    },

    shortDescription: {
        type: String,
    },

    category: {
        type: String,
        required: true
    },

    subCategory: {
        type: String,
    },


    // aita extra onno ecomarce e used er jonno

    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },

    // subCategory: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'SubCategory'
    // },

    tag: [
        {
            type: String,
        }
    ],

    status: {
        type: String,
        enum: ["pending", "active", "inactive"],
        default: "pending"
    },

    images: [
        {
            url: {
                type: String,
                isMain: {
                    type: Boolean,
                    default: false
                }
            }
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)