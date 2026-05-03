require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbConfig = require("./config/dbConfig")
const User = require('./models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

// Middleware
app.use(express.json())
app.use(cors())

// Database config
dbConfig()

app.post('/registration', async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body

    let existingUser = await User.findOne({ email: email })

    if (existingUser) {
        return res.send({ message: "User already exists" })
    }


    if (!terms) {
        return res.send({ message: "Please Accept Our Terms and Condition" })
    }

    if (!email || !password || !confirmPassword) {
        return res.send({ message: "Please fill all the field" })
    }

    if (password !== confirmPassword) {
        return res.send({ message: "password no matched" })
    }



    let user = new User({
        email: email,
        password: password,
        terms: terms
    })

    user.save()

    let token = jwt.sign({
        id: user._id,
        email: user.email
    }, "kjlxfhgkjfddc", { 
        expiresIn: "1d"
    })


    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "tarekrahman8295@gmail.com",
            pass: "bzfl syzo cqdv vlwj",
        },
    });

    try {
        const info = await transporter.sendMail({
            from: 'tarekrahman8295@gmail.com',
            to: email,
            subject: "Please Verify Your Email",
            html: `<body style=margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif><table border=0 cellpadding=0 cellspacing=0 width=100%><tr><td style="padding:20px 10px"align=center><table border=0 cellpadding=0 cellspacing=0 style=background:#fff;border-radius:8px;overflow:hidden width=600><tr><td style=background:#2ecc71;padding:20px;text-align:center;color:#fff><h1 style=margin:0;font-size:24px>EcoBazar</h1><p style="margin:5px 0 0">Fresh & Organic Marketplace<tr><td style=padding:30px;color:#333><h2 style=margin-top:0>Verify Your Email Address</h2><p>Hello User,<p>Thank you for signing up with EcoBazar! Please confirm your email address to activate your account and start shopping fresh, organic products.<table border=0 cellpadding=0 cellspacing=0 style="margin:30px 0"align=center><tr><td align=center><a href="http://localhost:5173/verifyemail/${token}" style="background:#2ecc71;color:#fff;padding:14px 24px;text-decoration:none;border-radius:5px;font-weight:700;display:inline-block">Verify Email</a></table><p>If the button above doesn't work, copy and paste this link into your browser:<p style=word-break:break-all;color:#2ecc71>http://localhost:5173/verifyemail/${token}<p>This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.<p>Thanks,<br>The EcoBazar Team<tr><td style=background:#f4f6f8;padding:20px;text-align:center;font-size:12px;color:#888><p style=margin:0>© 2026 EcoBazar. All rights reserved.<p style="margin:5px 0 0">Dhaka, Bangladesh</table></table>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);



        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }



    res.send({ message: "Registration Successfull" })



})


let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})