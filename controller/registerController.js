
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const JWT_SECRET = process.env.JWT_SECRET;

const registerController = async (req, res) => {

  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();
  res.status(201).json({ message: 'User registered' });
  
}

module.exports = registerController;