
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const JWT_SECRET = process.env.JWT_SECRET;

const registerController = async (req, res) => {

  const { username, email, password } = req.body;
  const ip = req.ip;

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

  const hashed = await bcrypt.hash(password, 10);
  const accessToken = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email: email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  const user = new User({ username, email, password: hashed, ip, refresh: refreshToken });
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({
    message: 'User registered',
    accessToken
  });
}

module.exports = registerController;