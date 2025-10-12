const User = require("../model/User");

const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const email = req.email;

    const foundUser = await User.findOne({email});
    const userRoles = foundUser.role;

    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    console.log('Matched role:', hasRole, 'Allowed:', allowedRoles, 'User:', userRoles);

    if (!hasRole) {
      return res.status(403).json({ message: 'You are not admin.' });
    } else {
      next();
    }

  };
};

module.exports = verifyRole;
