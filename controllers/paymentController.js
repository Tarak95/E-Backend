const axios = require('axios')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')

const paymentController = async (req, res) => {
    const { userId, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone } = req.body
    
    try {
        
        //cart data miye asa and product populet kora

        const cart = await Cart.find({ user: userId }).populate('product')

        //cart khali kita cak kora (khali thakle aikhanei atke debe )

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty. Cannot proceed to payment."
            });
        }

        let totalPrice = 0
        let pro = []

        
        //Dynamically price hisab kora and product ary toiri

        cart.forEach(item => {
            if (item.product) {
                //product e offer price thakle seta nebe na thakle regular price nebe
                const productPrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
                const itemTotal = productPrice * item.quantity;

                pro.push({
                    title: item.product.title,
                    price: item.product.price,
                    discountPrice: item.product.discountPrice,
                    sku: item.product.sku,
                    stock: item.product.stock,
                    category: item.product.category,
                    tag: item.product.tag,
                    status: item.product.status,
                    images: item.product.images,
                    quantity: item.quantity,
                    totalPrice: itemTotal
                })

                totalPrice += itemTotal;
            }
        });

        //says bar chake kora dam 0 ba tar kom kina
        if (totalPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid total price. Amount must be greater than 0."
            });
        }

        const tranId = "TXN-" + Date.now(); // Transaction id unike kora 

        const response = await axios.post(
            'https://sandbox.aamarpay.com/jsonpost.php',
            {
                store_id: 'aamarpaytest',
                tran_id: tranId,
                success_url: 'http://localhost:5000/api/payment/success', 
                fail_url: 'http://localhost:5000/api/payment/fail',
                cancel_url: 'http://localhost:5000/api/payment/cancel',
                amount: totalPrice,
                currency: 'BDT',
                signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
                desc: 'Ecommerce Product Purchase',
                cus_name: cus_name,
                cus_email: cus_email,
                cus_add1: cus_add1,
                cus_add2: cus_add2,
                cus_city: cus_city,
                cus_state: cus_state,
                cus_postcode: cus_postcode,
                cus_country: 'Bangladesh',
                cus_phone: cus_phone,
                type: 'json'
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        //  Database e order save kora
        const order = new Order({
            user: userId,
            products: pro,
            totalPrice: totalPrice,
            tranid: tranId
        })

        await order.save()

        // AamarPay theke paoua pyment url respons pathano 
        res.json(response.data);

    } catch (error) {
        console.error("AamarPay Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data || error.message
        });
    }
};

const getAllOrdersController = async (req, res) => {
    const { userid } = req.params
    try {
        let data = await Order.find({ user: userid })

        if (!data.length) {
            return res.status(404).json({
                success: false,
                message: 'Order Not Found'
            })
        }

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { paymentController, getAllOrdersController }