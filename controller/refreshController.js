
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const refreshController = async (req, res, next) => {
    const old_refresh = req.cookie;
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    
    jwt.verify( old_refresh, JWT_REFRESH_TOKEN, async (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Invalid or expired token.' });
        }

        req.email = decoded;
        const email = decoded;

        const foundUser = await User.findOne({email});
        console.log(foundUser);
        if (!foundUser) return res.send({message: 'This is a Hacked user.'});

        const accessToken = jwt.sign({ email }, JWT_ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email }, JWT_REFRESH_TOKEN, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'User successfully logged in.', accessToken });

        next();

    });
}

module.exports = refreshController;