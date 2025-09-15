const User = require('../model/User');

const users = async (req, res, next) => {
    const data = await User.find();
    res.send(data);

    next();
};

module.exports = users;