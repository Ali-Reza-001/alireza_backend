const jwt = require("jsonwebtoken");

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.userInfo.role || [];

    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    console.log('Matched role:', hasRole, 'Allowed:', allowedRoles, 'User:', userRoles);

    if (!hasRole) {
        return res.status(403).json({ message: 'You are not admin.' });
    } else {
        return res.status(200).json({ role: userRoles });
    }

    next();
  };
};

module.exports = verifyRole;
