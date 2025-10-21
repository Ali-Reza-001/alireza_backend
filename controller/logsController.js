const Log = require('../model/Log');
const bcrypt = require('bcrypt');


const getAllLogs = async (req, res) => {
    const data = await Log.find();
    res.send(data);
};

const getLog =  async (req, res) => {
    let {id} = req.params;
    if (id === 'undefined') {
        const foundLog = await Log.findOne({email: req.email});
        if (!foundLog) return res.send({message: 'This is a Hacked Log.'});
        const Logname = foundLog.Logname;
        const email = foundLog.email;
        const LogProfilePic = foundLog.LogProfilePic;
        const data = {Logname, email, LogProfilePic};
        return res.json(data);
    } else {
        console.log(id);
        const data = await Log.findOne({_id : id});
        res.json(data);
    }
}

const updateLog =  async (req, res) => {
    let {id} = req.params;
    if (!id) return res.status(400).json({message: "Log ID is required"});
    let {Logname, email, emailVerified, ip, password, role} = req.body;


    try {
        if (password.length < 30) { password = await bcrypt.hash(password, 10);}
        const data = await Log.updateOne({_id: id}, {$set: {Logname, email, emailVerified, ip, password, role}});
        res.json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error updating Log", error: error.message});
    }
}

const deleteLog =  async (req, res) => {
    const {id} = req.body;

    if(!id) {
        const data = await Log.deleteMany({});
        return res.json({message: "Logs deleted successfully !", data});
    }

    console.log(`Log with id ${id} deleted !`);
    const data = await Log.deleteOne({_id : id});
    res.json({message: "Log deleted successfully !", data});
}

module.exports = {deleteLog, updateLog, getLog, getAllLogs};