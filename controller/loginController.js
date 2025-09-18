
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const roles = require('../config/roles');

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const loginController = async (req, res) => {
  const old_refresh = req.cookie;
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'You are not signed in.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Password is wrong' });

  const userInfo = {
    role: [roles.User],
    email
  }

  const accessToken = jwt.sign({ userInfo }, JWT_ACCESS_TOKEN, { expiresIn: '15s' });
  const refreshToken = jwt.sign({ userInfo }, JWT_REFRESH_TOKEN, { expiresIn: '7d' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ message: 'User successfully logged in.', accessToken });
}

module.exports = loginController;