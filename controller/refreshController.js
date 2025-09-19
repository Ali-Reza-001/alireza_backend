
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const roles = require('../config/roles');

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const refreshController = async (req, res, next) => {
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
        if (!foundUser) return res.send({message: 'This is a Hacked user.'});

        const accessToken = jwt.sign({ email }, JWT_ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email }, JWT_REFRESH_TOKEN, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'RefreshToken Succeed.', accessToken });
        next();
    });
}

module.exports = refreshController;