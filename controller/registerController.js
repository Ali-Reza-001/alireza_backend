
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const sendVerificationEmail = require('../utils/emailVerifier');
const roles = require('../config/roles');

const JWT_EMAIL_TOKEN = process.env.JWT_EMAIL_TOKEN;

const registerController = async (req, res) => {

  const { username, email, password } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;


  // Allow letters, numbers, and common symbols. Reject if it contains < > " '
  const isSafePassword = /^[^\s<>"']{8,64}$/;
  // Allow letters, spaces, hyphens, apostrophes. Reject digits and symbols.
  const isValidName = /^[a-zA-Z\u0600-\u06FF\s'-]{2,50}$/;
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!isSafePassword.test(password)) return res.status(400).send({message: 'Password should be over 8 chars and just common symbols are allowed.'});
  if (!isValidEmail.test(email)) return res.status(400).send({message: 'Should be a valid email.'});
  if (!isValidName.test(username)) return res.status(400).send({message: 'Digits and symbols are not allowed as username.'});


  const foundUser = await User.findOne({email});
  if (foundUser) return res.status(409).send({message: 'Email is already in system.'});

  // Getting the IP information from IPinfo.io API
  const IPinfoToken = process.env.IPINFO_TOKEN;
  const ipInfo = await 
  fetch(`https://ipinfo.io/${ip}?token=${IPinfoToken}`)
  .then(response => response.json())
  .catch(error => {console.error('Error fetching IP info:', error)});

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashed, ip, ipInfo });
  await user.save();

  const emailToken = jwt.sign({userId: user._id}, JWT_EMAIL_TOKEN, {expiresIn: '1d'});

  sendVerificationEmail(email, emailToken);

  res.status(201).json({
    message: ' User registered successfully. ',
  });
}

module.exports = registerController;