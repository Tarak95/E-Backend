 const nodemailer = require("nodemailer");



 const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "tarekrahman8295@gmail.com",
            pass: "bzfl syzo cqdv vlwj",
        },
    });


    let mailVerification = async (token, email)=>{

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
    }



    let resetPasswordMail = async (token, email)=>{

           try {
        const info = await transporter.sendMail({
            from: 'tarekrahman8295@gmail.com',
            to: email,
            subject: "Please Reset Your Password",
              html: `<body style=margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5><table cellpadding=0 cellspacing=0 style="background-color:#f5f5f5;padding:20px 0"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style=background-color:#fff;border-radius:8px;overflow:hidden width=600><tr><td align=center style=background-color:#28a745;padding:20px><h1 style=color:#fff;margin:0>Ecobazar</h1><tr><td style=padding:30px;color:#333><h2 style=margin-top:0>Reset Your Password</h2><p>Hello,<p>We received a request to reset your password for your Ecobazar account.<p>Click the button below to set a new password:<p style="text-align:center;margin:30px 0"><a href="http://localhost:5173/resetpassword/${token}" style="background-color:#28a745;color:#fff;text-decoration:none;padding:12px 25px;border-radius:5px;display:inline-block;font-weight:700">Reset Password</a><p>If you didn’t request a password reset, you can safely ignore this email. Your password will not be changed.<p>This link will expire in <strong>30 minutes</strong> for security reasons.<p>Thanks,<br>The Ecobazar Team<tr><td align=center style=background-color:#f0f0f0;padding:20px;font-size:12px;color:#777><p style=margin:0>© 2026 Ecobazar. All rights reserved.<p style="margin:5px 0">If you need help, contact us at <a href=mailto:support@ecobazar.com>support@ecobazar.com</a></table></table>his link into your browser:<p style=word-break:break-all;color:#2ecc71>http://localhost:5173/resetpassword/${token}<p>This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.<p>Thanks,<br>The EcoBazar Team<tr><td style=background:#f4f6f8;padding:20px;text-align:center;font-size:12px;color:#888><p style=margin:0>© 2026 EcoBazar. All rights reserved.<p style="margin:5px 0 0">Dhaka, Bangladesh</table></table></body>`, // HTML body
    });


        console.log("Message sent: %s", info.messageId);



        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Unable to send mail:", err);
    }
    }
    module.exports = {mailVerification,resetPasswordMail}