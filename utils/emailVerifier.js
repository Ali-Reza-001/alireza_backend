
const nodemailer = require('nodemailer');
const DOMAIN = require('../config/DOMAIN');

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});


const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${DOMAIN.original}/resend?verifyToken=${token}`;
  console.log(verificationLink);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:10px solid #000;">
        <tr>
          <td align="center" style="padding:20px;">
            <img src="https://ali-reza.dev/favicon.png" width="150" alt="Logo" style="display:block; margin-bottom:30px" />
            <p style="font-size:16px; color:#333; font-family:Arial, sans-serif; line-height:1.5;">
              Hello my friend,<br><br>
              This is a verification email. Click the button below to verify your email:
            </p>
            <a href="${verificationLink}" style="display:inline-block; padding:12px 24px; background-color:#000; color:#fff; text-decoration:none; border-radius:8px; font-family:Arial, sans-serif; margin-top:20px;">
              Verify Email
            </a>
            <p style="font-size:12px; color:#999; font-family:Arial, sans-serif; margin-top:30px;">
              If this wasn't you, please ignore this email.
            </p>
          </td>
        </tr>
      </table>

    `,
  });
};

module.exports = sendVerificationEmail;
