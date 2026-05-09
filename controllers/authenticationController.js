const User = require('../models/userModel');
const { mailVerification, resetPasswordMail } = require('../utils/email');
const { emptyFieldValidation } = require('../utils/validation');
const tokenGenerator = require('../utils/tokenGenerator');
const existingData = require('../utils/exixtingData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//  Registration Controller


const registrationController = async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body;

    let users = await existingData(res, { email: email });
    if (users) {
        return res.send({ message: 'User Already Exists' });
    }

    if (!terms) {
        return res.send({ message: "Please Accept Our Terms and Condition" });
    }

    emptyFieldValidation(res, email, password, confirmPassword);

    if (password !== confirmPassword) {
        return res.send({ message: "Password not matched" });
    }

    const hash = bcrypt.hashSync(password, 10);
    let user = new User({
        email: email,
        password: hash,
        terms: terms,
    });

    await user.save();

    let token = tokenGenerator({
        id: user._id,
        email: user.email
    }, "kjlxfhgkjfddc", "1d");

    mailVerification(token, email);
    res.send({ message: "Registration Successful" });
};

//  Login Controller


// const loginController = async (req, res) => {
//     const { email, password } = req.body;

//     let users = await existingData(res, { email: email });
//     if (!users) {
//         return res.send({ message: "User not found" });
//     }


//     emptyFieldValidation(res, email, password);

//     let pass = bcrypt.compareSync(password, users.password);
//     if (!pass) {
//         return res.send({ message: "Invalid Credentials" });
//     }

//     res.send({ message: "Login Successful" });
// };




let loginController = async (req, res) => {
    const { email, password } = req.body

    let users = await User.findOne({ email: email })
    if (!users) {
        return res.send({ message: "User not found" })
    }
    emptyFieldValidation(res, email, password)

    let pass = bcrypt.compareSync(password, users.password);

    if (!pass) {
        return res.send({ message: "Invalid Credential" })
    }

    res.send({
        message: "Login Successfull"
    })

}

//  Forgot Password Controller


const forgotPasswordController = async (req, res) => {
    let { email } = req.body;

    emptyFieldValidation(res, email)    //ttthds


    let users = await User.findOne({ email: email });
    if (!users) {
        return res.send({ message: "User not found" });
    }

    let token = tokenGenerator({
        id: users._id,
        email: users.email
    }, "kjlxfhgkjfddc", "1d");

    resetPasswordMail(token, email);
    res.send({ message: "Please Check Your Email" });
};

//  Reset Password Controller


const resetPasswordController = async (req, res) => {
    let { newPassword, confirmPassword } = req.body;
    let { token } = req.params;

    if (newPassword !== confirmPassword) {
        return res.send({ message: "Confirm Password Not Matched" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            res.send({ message: "Unauthorized" })
        } else {
            const hash = bcrypt.hashSync(newPassword, 10);

            console.log(decoded)

            const updateData = await User.findByIdAndUpdate({ _id: decoded.id }, { password: hash }, { new: true })
            res.send({ message: "Password Updated", updateData })
        }
    });
};

//  Resend Verification Email


const resendVerificationEmailController = async (req, res) => {
    let { email } = req.body;
    let user = await User.findOne({ email: email });

    if (!user) return res.send({ message: "User not found" });

    let token = tokenGenerator({
        id: user._id,
        email: user.email
    }, "kjlxfhgkjfddc", "1d");

    mailVerification(token, email);
    res.send({ message: 'Check your email for verification' });
};



// verifyEmailController


let verifyEmailController = async (req, res) => {
    const { token } = req.params


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            res.send({ message: "Unauthorized" })
        } else {
            const userId = decoded.id
            let findUser = await User.findById(userId)
            if (findUser.isVerified) {
                return res.send({ message: "User already verified" })
            } else {
                findUser.isVerified = true
                findUser.save()
                res.send({ message: "Email verified successfully" })
            }

        }
    });

};






module.exports = {
    registrationController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    resendVerificationEmailController,
    verifyEmailController
};
