require('node:dns').setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbConfig = require("./config/dbConfig")
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./controllers/authenticationController')
const { getAllUsersController, singleUserDataController, deleteUserController, updateUserController } = require('./controllers/userController');
const { createProductController,allProductController, singleProductController, deleteProductController, updateProductController  } = require('./controllers/productController')
const axios = require('axios')


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
app.post('/createproduct', createProductController)
app.get('/allProduct', allProductController)
app.post('/singleProduct', singleProductController)
app.delete('/deleteProduct', deleteProductController)
app.post('/updateProduct/:id', updateProductController)


// Payment


app.post('/payment', async (req, res) => {
    try {
        const data = await axios.post(
            'https://sandbox.aamarpay.com/jsonpost.php',
            {
                store_id: "aamarpaytest",
                signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
                ...req.body,
                tran_id: Date.now(),
                currency: "BDT",
                success_url: "https://example.com/success.php",
                fail_url: "https://example.com/fail.php",
                cancel_url: "https://example.com/cancel.php",
                desc: "Lend Money",
                type: "json"
            }
        );

        res.send(data.data);

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});






// User management


app.get('/allusers', getAllUsersController)
app.get('/singleuser/:id', singleUserDataController)
app.delete('/deleteuser/:id', deleteUserController)
app.post('/update/:id', updateUserController)



let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})