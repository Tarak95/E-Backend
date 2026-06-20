const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

const createCart = async (req,res) => {
    const {proid,userid} = req.body

    const existingProduct = await Product.findOne({_id: proid})
   


    if(!existingProduct){
        return res.json({
            success: false,
            message: 'Product Not Found'
        })
    }


    const existingProductOnCart = await Cart.findOne({product: proid,user:userid})
    

    if(existingProductOnCart){
        existingProductOnCart.quantity += 1
        existingProductOnCart.totalPrice = existingProductOnCart.totalPrice + existingProduct.price
        existingProductOnCart.save()
    }else{
        let cart = new Cart({
                product: proid,
                quantity: 1,
                totalPrice: existingProduct.price,
                user: userid
            })

            cart.save()
    }

    

    res.json({
        success: true,
        message: "Product added successfully"
    })


}

const increDecre = async (req,res)=>{
    const {id} = req.params
    const {type} = req.body

    const cart = await Cart.findOne({product: id})
    const product = await Product.findOne({_id: id})
    console.log(product)

    if(type === "plus"){
        cart.quantity += 1
        cart.totalPrice = cart.totalPrice + product.price
        await cart.save()
    }else{
        cart.quantity -=  1
        cart.totalPrice = cart.totalPrice - product.price
        await cart.save()
    }

     
     res.json({
        success: true,
        message: "Cart Updated successfully"
     })

}

const proDelete = async (req,res) => {
    const {id} = req.params

    await Cart.findByIdAndDelete({_id: id})

    res.json({
        success: true,
        message: "Product Deleted"
    })

}

const getCart = async (req,res)=>{
    const {userId} = req.params
    console.log(userId)

    const cart = await Cart.find({user: userId}).populate('user product')

    let totalPrice =  0

    cart.map(item=>{
        totalPrice += item.totalPrice
    })

    res.json({
        cart,
        totalPrice
    })


}


module.exports = {createCart, increDecre, proDelete, getCart}

