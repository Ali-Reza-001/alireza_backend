const User = require('../model/User');

const getUser =  async (req, res) => {
    const {id} = req.params;
    console.log(id)
    const data = await User.findOne({_id : id});
    res.json({message: "User conveyed !", data});
}

const deleteUser =  async (req, res) => {
    const {id} = req.body;
    console.log(id)
    const data = await User.deleteOne({_id : id});
    res.json({message: "User deleted successfully !", data});
}

module.exports = {deleteUser, getUser};