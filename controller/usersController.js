const User = require('../model/User');


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

const deleteUser =  async (req, res) => {
    const {id} = req.body;
    console.log(id);
    const data = await User.deleteOne({_id : id});
    res.json({message: "User deleted successfully !", data});
}

module.exports = {deleteUser, getUser, getAllUsers};