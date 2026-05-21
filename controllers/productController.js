const { emptyFieldValidation } = require('../utils/validation')
const Product = require('../models/productModel')

const createProductController = async (req, res) => {
    const { title, price, category } = req.body
    emptyFieldValidation(res, title, price, category)

    // title

    let existingTitle = await Product.findOne({ title: title })
    if (existingTitle) {
        return res.send({
            success: false,
            message: "Title already exist"
        })
    }



    let sku = `${Date.now()}-${new Date().getFullYear()}`

    //    sku exists

    let existingSku = await Product.findOne({ sku: sku })
    if (existingSku) {
        return res.send({
            success: false,
            message: "Something went wrong. Please try again later."
        })
    }

    let product = new Product({
        ...req.body,
        sku: sku
    })

    await product.save()

    res.json({
        success: true,
        message: "Product Created"
    })


}



// get all product 

let allProductController = async (req, res) => {
    try {
        let allProduct = await Product.find({})
        return res.status(200).json({
            success: true,
            message: 'All products available',
            allProduct: allProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message
        })
    }
}

// get single product 

let singleProductController = async (req, res) => {
    let { title } = req.body

    try {
        let singleProductData = await Product.findOne({ title })
        return res.status(200).json({
            success: true,
            message: `Product details.`,
            data: singleProductData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message
        })
    }
}

// product delete

let deleteProductController = async (req, res) => {
    let { id } = req.body
    try {
        let deleteProductData = await Product.findByIdAndDelete({ _id: id })
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message
        })
    }
}

// product update

let updateProductController = async (req, res) => {
    let { id } = req.params

    try {
        let updateProduct = await Product.findByIdAndUpdate({ _id: id }, req.body, { new: true })
        return res.status(200).json({
            success: true,
            message: 'Product update successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message
        })
    }
}


module.exports = { createProductController, allProductController, singleProductController, deleteProductController, updateProductController }