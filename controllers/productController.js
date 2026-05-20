const { emptyFieldValidation } = require('../utils/validation')
const Product = require('../models/productModel')

const createProductController = async (req, res) => {
    const { title, price, category } = req.body
    emptyFieldValidation(res, title, price, category)


    let sku = `${Date.now()}-${new Date().getFullYear()}`

   

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


module.exports = { createProductController }