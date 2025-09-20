const User = require('../model/User');

const deleteUser =  async (req, res) => {
    const _id = req.id;
    const data = await User.deleteOne({_id});
    res.json({message: "User deleted successfully !", data});
}

module.exports = {deleteUser};