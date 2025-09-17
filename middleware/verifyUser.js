const jwt = require("jsonwebtoken");

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;

const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const accessToken = authHeader?.split(' ')[1];
    console.log('line 8'+accessToken)
    if (!accessToken) return res.status(403).send({message: 'You are not allowed.'});

    jwt.verify( accessToken, JWT_ACCESS_TOKEN, (err, decoded) => {
        console.log('line 12'+err)
        if (err) {
            return res.status(403).send({ message: 'Invalid or expired token.' });
        }

        req.email = decoded;
        next();
    });
}

module.exports = verifyUser;