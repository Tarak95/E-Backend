const nodemailer = require("nodemailer");

// Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "tarekrahman8295@gmail.com",
    pass: process.env.EMAIL_PASS || "skfosqnttxyqbcyd", // App Password
  },
});

// 1. Mail Verification Function
let mailVerification = async (token, email) => {
  try {
    const verifyUrl = `http://localhost:3000/verifyemail/${token}`;

    const info = await transporter.sendMail({
      from: '"EcoBazar" <tarekrahman8295@gmail.com>',
      to: email,
      subject: "Please Verify Your Email - EcoBazar",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding:20px 10px;" align="center">
              <table border="0" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; width:100%; max-width:600px;">
                <tr>
                  <td style="background:#2ecc71; padding:20px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size:24px;">EcoBazar</h1>
                    <p style="margin:5px 0 0; font-size:14px;">Fresh & Organic Marketplace</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <h2 style="margin-top:0;">Verify Your Email Address</h2>
                    <p>Hello User,</p>
                    <p>Thank you for signing up with EcoBazar! Please confirm your email address to activate your account and start shopping fresh, organic products.</p>
                    
                    <table border="0" cellpadding="0" cellspacing="0" style="margin:30px auto;" align="center">
                      <tr>
                        <td align="center" style="border-radius:5px; background:#2ecc71;">
                          <a href="${verifyUrl}" target="_blank" style="background:#2ecc71; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block;">Verify Email</a>
                        </td>
                      </tr>
                    </table>

                    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break:break-all; color:#2ecc71;"><a href="${verifyUrl}" style="color:#2ecc71;">${verifyUrl}</a></p>
                    <p>This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
                    <p>Thanks,<br>The EcoBazar Team</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f4f6f8; padding:20px; text-align:center; font-size:12px; color:#888888;">
                    <p style="margin:0;">© 2026 EcoBazar. All rights reserved.</p>
                    <p style="margin:5px 0 0;">Dhaka, Bangladesh</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    console.log("Verification Mail Sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending verification mail:", err);
  }
};

// 2. Reset Password Mail Function
let resetPasswordMail = async (token, email) => {
  try {
    const resetUrl = `http://localhost:3000/resetpassword/${token}`;

    const info = await transporter.sendMail({
      from: '"EcoBazar" <tarekrahman8295@gmail.com>',
      to: email,
      subject: "Reset Your Password - EcoBazar",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f5f5;">
        <table cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:20px 0;" width="100%">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; width:100%; max-width:600px;">
                <tr>
                  <td align="center" style="background-color:#28a745; padding:20px;">
                    <h1 style="color:#ffffff; margin:0;">EcoBazar</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <h2 style="margin-top:0;">Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your EcoBazar account.</p>
                    
                    <p style="text-align:center; margin:30px 0;">
                      <a href="${resetUrl}" target="_blank" style="background-color:#28a745; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:5px; display:inline-block; font-weight:bold;">Reset Password</a>
                    </p>

                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break:break-all; color:#28a745;"><a href="${resetUrl}" style="color:#28a745;">${resetUrl}</a></p>

                    <p>If you didn’t request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                    <p>This link will expire in <strong>30 minutes</strong> for security reasons.</p>
                    <p>Thanks,<br>The EcoBazar Team</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="background-color:#f0f0f0; padding:20px; font-size:12px; color:#777777;">
                    <p style="margin:0;">© 2026 EcoBazar. All rights reserved.</p>
                    <p style="margin:5px 0;">If you need help, contact us at <a href="mailto:support@ecobazar.com" style="color:#28a745;">support@ecobazar.com</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    console.log("Reset Password Mail Sent: %s", info.messageId);
  } catch (err) {
    console.error("Unable to send reset password mail:", err);
  }
};

module.exports = { mailVerification, resetPasswordMail };