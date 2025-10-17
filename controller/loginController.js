
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const roles = require('../config/roles');

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const loginController = async (req, res) => {
  const old_refresh = req.cookies.refreshToken;
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });

  const { email, password, constUser } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: 'You are not signed in.' });
  if (!user.emailVerified) return res.status(401).json({ message: 'Your email is not verified yet.' });
  
  user.refresh = user.refresh.filter(token => {
    try {
      jwt.verify(token, JWT_REFRESH_TOKEN);
      return true;
    } catch {
      return false;
    }
  });
  await user.save();

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Password is wrong' });

  const accessToken = jwt.sign({ email }, JWT_ACCESS_TOKEN, { expiresIn: '15m' });

  if (Boolean(constUser)) {
    const refreshToken = jwt.sign({ email }, JWT_REFRESH_TOKEN, { expiresIn: '7d' });
    console.log('The user is a const user');
    
    const index = user.refresh.indexOf(old_refresh);
    if (index !== -1) {
      user.refresh[index] = refreshToken;
    } else if (!user.refresh.includes(refreshToken)) {
      user.refresh.push(refreshToken);
    }
    if (user.refresh.length > 5) {
      user.refresh.shift(); // remove oldest
    }
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  res.json({ message: 'User successfully logged in.', accessToken });
}

module.exports = loginController;