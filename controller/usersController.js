const User = require('../model/User');

const deleteUser =  async (req, res) => {
    const {id} = req.body;
    console.log(id)
    const data = await User.deleteOne({_id : id});
    res.json({message: "User deleted successfully !", data});
}

module.exports = {deleteUser};