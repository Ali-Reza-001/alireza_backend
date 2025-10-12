const jwt = require('jsonwebtoken');
const User = require('../model/User');
const sendVerificationEmail = require('../utils/emailVerifier');
const JWT_EMAIL_TOKEN = process.env.JWT_EMAIL_TOKEN;


const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!isValidEmail.test(email)) return res.status(400).json({ error: "Invalid email format" });

    const foundUser  = await User.findOne({ email });

    
    const emailToken = jwt.sign({userId: foundUser._id}, JWT_EMAIL_TOKEN, {expiresIn: '1d'});

    sendVerificationEmail(email, emailToken);
    

    res.status(200).json({ message: "Verification email resent successfully." });
}

module.exports = resendVerificationEmail;