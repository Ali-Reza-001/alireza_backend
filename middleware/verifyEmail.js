const jwt = require('jsonwebtoken');
const User = require('../model/User');
const DOMAIN = require('../config/DOMAIN');
const JWT_EMAIL_TOKEN = process.env.JWT_EMAIL_TOKEN;

const verifyEmail = async (req, res) => {
  const token = req.query.verifyToken;
  
  jwt.verify(token, JWT_EMAIL_TOKEN, async (err, decoded) => {
    if (err) {
        console.log(err);
        return res.status(400).send('Invalid or expired token');
    }

    console.log(decoded);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).send('User not found');

    user.emailVerified = true;
    await user.save();

    res.json(`Your email verified successfully! <br/> You can now login.`);
  });
};

module.exports = verifyEmail;
