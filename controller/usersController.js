const User = require('../model/User');
const bcrypt = require('bcrypt');


const getAllUsers = async (req, res) => {
    const data = await User.find();
    res.send(data);
};

const getUser =  async (req, res) => {
    let {id} = req.params;
    if (id === 'undefined') {
        const foundUser = await User.findOne({email: req.email});
        if (!foundUser) return res.send({message: 'This is a Hacked user.'});
        const username = foundUser.username;
        const email = foundUser.email;
        const userProfilePic = foundUser.userProfilePic;
        const data = {username, email, userProfilePic};
        return res.json(data);
    } else {
        console.log(id);
        const data = await User.findOne({_id : id});
        res.json(data);
    }
}

const updateUser =  async (req, res) => {
    let {id} = req.params;
    if (!id) return res.status(400).json({message: "User ID is required"});
    let {username, email, emailVerified, ip, password, role} = req.body;


    try {
        if (password.length < 30) { password = await bcrypt.hash(password, 10);}
        const data = await User.updateOne({_id: id}, {$set: {username, email, emailVerified, ip, password, role}});
        res.json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error updating user", error: error.message});
    }
}

const deleteUser =  async (req, res) => {
    const {id} = req.body;
    console.log(id);
    const data = await User.deleteOne({_id : id});
    res.json({message: "User deleted successfully !", data});
}

module.exports = {deleteUser, updateUser, getUser, getAllUsers};