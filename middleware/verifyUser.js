const jwt = require("jsonwebtoken");

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;

const verifyUser = async (req, res, next) => {

    // Exceptions
    if (req.originalUrl == '/api/blogsControl' && req.method == 'GET') {
        return next();
    }

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