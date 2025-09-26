const User = require('../model/User');


const getAllUsers = async (req, res) => {
    const data = await User.find();
    res.send(data);
};

const getUser =  async (req, res) => {
    const {id} = req.params;
    console.log(id);
    const data = await User.findOne({_id : id});
    res.json(data);
}

const deleteUser =  async (req, res) => {
    const {id} = req.body;
    console.log(id);
    const data = await User.deleteOne({_id : id});
    res.json({message: "User deleted successfully !", data});
}

module.exports = {deleteUser, getUser, getAllUsers};