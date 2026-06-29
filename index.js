require('node:dns').setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbConfig = require("./config/dbConfig")
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./controllers/authenticationController')
const { getAllUsersController, singleUserDataController, deleteUserController, updateUserController } = require('./controllers/userController');
const { createProductController, allProductController, singleProductController, deleteProductController, updateProductController } = require('./controllers/productController')
const axios = require('axios')
const { createCart, increDecre, getCart, proDelete } = require('./controllers/cartController')
const multer = require('multer')

const { paymentController, getAllOrdersController } = require('./controllers/paymentController')





// const { rateLimit } = require('express-rate-limit')
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 3,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
//     ipv6Subnet: 56,
// })
// app.use(limiter)



// ==== multer ====

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });



// Middleware
app.use(express.json())
app.use(cors())

// Database 
dbConfig()

app.post("/registration", registrationController);
app.post("/login", loginController);
app.post("/forgotpassword", forgotPasswordController);
app.post("/resetpassword/:token", resetPasswordController);
app.post("/resendVerificationEmail", resendVerificationEmailController);
app.post('/verifyemail/:token', verifyEmailController)


//Product Create

app.post('/createproduct', upload.array('photos', 5), createProductController)

app.get('/allproduct', allProductController)
app.get('/singleproduct/:id', singleProductController)

app.delete('/deleteproduct/:id', deleteProductController) 
app.post('/updateproduct/:id', upload.array('photos', 5), updateProductController) 



// Payment


// Cart Management

app.post('/cart/create', createCart)
app.post('/cart/update/:id', increDecre)
app.get('/cart/:userId', getCart)
app.delete('/cart/:id', proDelete)


// Order Management
app.post('/payment', paymentController)
app.get('/getorders/:userid', getAllOrdersController)




// User management


app.get('/allusers', getAllUsersController)
app.get('/singleuser/:id', singleUserDataController)
app.delete('/deleteuser/:id', deleteUserController)
app.post('/update/:id', updateUserController)



let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})