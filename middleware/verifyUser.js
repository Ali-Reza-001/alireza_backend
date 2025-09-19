const jwt = require("jsonwebtoken");
const User = require("../model/User");

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const verifyUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) return res.status(403).json({message: 'You are not allowed.'});

    jwt.verify( accessToken, JWT_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Access token failed' });
        }

        req.email = decoded.email;

        next();
    });
}

module.exports = verifyUser;