const User = require('../models/userModel')

const {mailVerification} = require('../utils/email')

const{emptyFieldValidation} = require('../utils/validation')

const tokenGenerator = require('../utils/tokenGenerator')
const existingData = require('../utils/exixtingData')



let registrationController = async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body


    
        let users = await existingData(res,{email:email})
        if(users){
            return
        }

    // let existingUser = await User.findOne({ email: email })


    // let registrationController = async (req, res) => {
    //     const {email,password,confirmPassword, terms} = req.body



    // }

    // if (existingUser) {
    //     return res.send({ message: "User already exists" })
    // }


    if (!terms) {
        return res.send({ message: "Please Accept Our Terms and Condition" })
    }

    // if (!email || !password || !confirmPassword) {
    //     return res.send({ message: "Please fill all the field" })
    // }


    emptyFieldValidation(res, email, password, confirmPassword)

    if (password !== confirmPassword) {
        return res.send({ message: "password no matched" })
    }



    let user = new User({
        email: email,
        password: password,
        terms: terms
    })

    user.save()

    // let token = jwt.sign({
    //     id: user._id,
    //     email: user.email
    // }, "kjlxfhgkjfddc", { 
    //     expiresIn: "1d"
    // })


    let token = tokenGenerator({
        id: user._id,
        email: user.email
    }, "kjlxfhgkjfddc","1d" )


    


   

     mailVerification(token, email)



    res.send({ message: "Registration Successfull" })



}

module.exports = { registrationController }