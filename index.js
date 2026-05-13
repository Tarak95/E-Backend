require('node:dns').setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbConfig = require("./config/dbConfig")
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./controllers/authenticationController')
const { getAllUsersController, singleUserDataController, deleteUserController, updateUserController } = require('./controllers/userController');



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






// User management


app.get('/allusers', getAllUsersController)
app.get('/singleuser/:id', singleUserDataController)
app.delete('/deleteuser/:id', deleteUserController)
app.post('/update/:id', updateUserController)



let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})