require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbConfig = require("./config/dbConfig")


// const User = require('./models/userModel')
// const jwt = require('jsonwebtoken')

const {registrationController} = require('./controllers/authenticationController')


// Middleware
app.use(express.json())
app.use(cors())

// Database 
dbConfig()

app.post('/registration', registrationController)


let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})