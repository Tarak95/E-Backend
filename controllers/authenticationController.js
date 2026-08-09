const User = require('../models/userModel');
const { mailVerification, resetPasswordMail } = require('../utils/email');
const { emptyFieldValidation } = require('../utils/validation');
const tokenGenerator = require('../utils/tokenGenerator');
const existingData = require('../utils/exixtingData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//  Registration Controller


// const registrationController = async (req, res) => {
//     const { email, password, confirmPassword, name } = req.body;

//     let users = await existingData(res, { email: email });
//     if (users) {
//         return res.send({ message: 'User Already Exists' });
//     }

//     emptyFieldValidation(res, email, password, confirmPassword);

//     if (password !== confirmPassword) {
//         return res.send({ message: "Password not matched" });
//     }

//     const hash = bcrypt.hashSync(password, 10);
//     let user = new User({
//         email: email,
//         password: hash,
//         name: name,
//     });

//     await user.save();

//     let token = tokenGenerator({
//         id: user._id,
//         email: user.email
//     }, process.env.ACCESS_TOKEN_SECRET, "1d");

//     mailVerification(token, email);
//     res.send({ message: "Registration Successful" });
// };

const registrationController = async (req, res) => {
  try {
    // phone যুক্ত করা হলো
    const { email, password, confirmPassword, name, phone } = req.body;

    // ১. অলরেডি ইউজার আছে কিনা চেক
    let users = await existingData(res, { email: email });
    if (users) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // ২. রিকোয়ার্ড ফিল্ড ভ্যালিডেশন
    if (!email || !password || !confirmPassword || !name) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ৩. পাসওয়ার্ড ম্যাচিং চেক
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ৪. পাসওয়ার্ড হ্যাশ করা ও ডাটাবেজে সেভ
    const hash = bcrypt.hashSync(password, 10); 
    let user = new User({
      email: email,
      password: hash,
      name: name,
      phone: phone || "", // Phone যুক্ত করা হলো
    });

    await user.save();

    // ৫. টোকেন জেনারেট ও ইমেইল পাঠানো
    let token = tokenGenerator(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      "1d"
    );

    await mailVerification(token, email);

    return res.status(200).json({ message: "Registration Successful. Please check your email." });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// loginController


// let loginController = async (req, res) => {
//     const { email, password } = req.body

//     let users = await User.findOne({ email: email })
//     if (!users) {
//         return res.send({ message: "User not found" })
//     }
//     emptyFieldValidation(res, email, password)

//     let pass = bcrypt.compareSync(password, users.password);

//     if (!pass) {
//         return res.send({ message: "Invalid Credential" })
//     }


      
//     let token = tokenGenerator({
//         id: users._id,
//         email: users.email
//     }, process.env.ACCESS_TOKEN_SECRET, "1d");

//     res.send({
//         message: "Login Successfull",
//         token: token 
        
//     })

// }



let loginController = async (req, res) => {
  const { email, password } = req.body;

  let users = await User.findOne({ email: email });
  if (!users) {
    return res.send({ success: false, message: "User not found" });
  }
  emptyFieldValidation(res, email, password);

  let pass = bcrypt.compareSync(password, users.password);
  if (!pass) {
    return res.send({ success: false, message: "Invalid Credential" });
  }

  // ✅ token যোগ করা হলো
  let token = tokenGenerator(
    { id: users._id, email: users.email },
    process.env.ACCESS_TOKEN_SECRET,
    "1d"
  );

  res.send({
    success: true,
    message: "Login Successfull",
    token: token, // ✅
    data: {
      _id: users._id,
      name: users.name,
      email: users.email,
      isVerified: users.isVerified,
      role: users.role,
      isHold: users.isHold,
    }
  });
};

//  Forgot Password Controller


// const forgotPasswordController = async (req, res) => {
//     let { email } = req.body;

//     emptyFieldValidation(res, email)


//     let users = await User.findOne({ email: email });
//     if (!users) {
//         return res.send({ message: "User not found" });
//     }

//     let token = tokenGenerator({
//         id: users._id,
//         email: users.email
//     }, process.env.ACCESS_TOKEN_SECRET, "1d");

//     resetPasswordMail(token, email);
//     res.send({ message: "Please Check Your Email" });
// };





let forgotPasswordController = async (req, res) => {
    let { email } = req.body;

    emptyFieldValidation(res, email);

    let users = await User.findOne({ email: email });
    if (!users) {
        return res.status(404).send({ message: "User not found" });
    }

    let token = tokenGenerator({
        id: users._id,
        email: users.email
    }, process.env.ACCESS_TOKEN_SECRET, "1d");

    resetPasswordMail(token, email);
    res.status(200).send({ message: "Please Check Your Email" });
};

//  Reset Password Controller


// const resetPasswordController = async (req, res) => {
//     let { newPassword, confirmPassword } = req.body;
//     let { token } = req.params;

//     if (newPassword !== confirmPassword) {
//         return res.send({ message: "Confirm Password Not Matched" });
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
//         if (err) {
//           return  res.send({ message: "Unauthorized" })  
//         } else {
//             const hash = bcrypt.hashSync(newPassword, 10);

//             console.log(decoded)

//             const updateData = await User.findByIdAndUpdate({ _id: decoded.id }, { password: hash }, { new: true })
//             res.send({ message: "Password Updated", updateData })
//         }
//     });
// };



const resetPasswordController = async (req, res) => {
    let { newPassword, confirmPassword } = req.body;
    let { token } = req.params; 

    if (newPassword !== confirmPassword) {
        return res.status(400).send({ message: "Confirm Password Not Matched" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: "Unauthorized or Expired Token" });
        } else {
            try {
                const hash = bcrypt.hashSync(newPassword, 10);

               
                const updateData = await User.findByIdAndUpdate(
                    decoded.id, 
                    { password: hash }, 
                    { new: true }
                );

                res.status(200).send({ message: "Password Updated", updateData });
            } catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
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
    }, process.env.ACCESS_TOKEN_SECRET, "1d");

    mailVerification(token, email);
    res.send({ message: 'Check your email for verification' });
};



// verifyEmailController


let verifyEmailController = async (req, res) => {
    const { token } = req.params


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
           return res.send({ message: "Unauthorized" })  
        } else {
            const userId = decoded.id
            let findUser = await User.findById(userId)
            if (findUser.isVerified) {
                return res.send({ message: "User already verified" })
            } else {
                findUser.isVerified = true
              await  findUser.save()  
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
