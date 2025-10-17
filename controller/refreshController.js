
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const roles = require('../config/roles');

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const refreshController = async (req, res) => {
    const old_refresh = req.cookies.refreshToken;
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    
    jwt.verify( old_refresh, JWT_REFRESH_TOKEN, async (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Refreshtoken failed.' });
        }

        const email = decoded.email;

        const foundUser = await User.findOne({email});
        if (!foundUser) return res.send({message: 'Invalid refresh token or user not found.'});
        
        
        foundUser.refresh = foundUser.refresh.filter(token => {
            try {
              jwt.verify(token, JWT_REFRESH_TOKEN);
              return true;
            } catch {
              return false;
            }
        });
        await foundUser.save();

        const accessToken = jwt.sign({ email }, JWT_ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email }, JWT_REFRESH_TOKEN, { expiresIn: '7d' });

        const index = foundUser.refresh.indexOf(old_refresh);
        if (index !== -1) {
            foundUser.refresh[index] = refreshToken;
        } else if (!foundUser.refresh.includes(refreshToken)) {
            foundUser.refresh.push(refreshToken);
        }
        if (foundUser.refresh.length > 5) {
            foundUser.refresh.shift(); // remove oldest
        }
        await foundUser.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'RefreshToken Succeed.', accessToken });
    });
}

module.exports = refreshController;