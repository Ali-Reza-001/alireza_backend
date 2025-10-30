const Blog = require('../model/Blog');
const bcrypt = require('bcrypt');


const getAllBlogs = async (req, res) => {
    const data = await Blog.find();
    res.send(data);
};

const getBlog =  async (req, res) => {
    let {id} = req.params;
    console.log(id);
    const data = await Blog.findOne({_id : id});
    res.json(data);
}

const updateBlog =  async (req, res) => {
    let {id} = req.params;
    if (!id) return res.status(400).json({message: "Blog ID is required"});
    let {username, email, emailVerified, ip, password, role} = req.body;


    try {
        if (password.length < 30) { password = await bcrypt.hash(password, 10);}
        const data = await Blog.updateOne({_id: id}, {$set: {username, email, emailVerified, ip, password, role}});
        res.json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error updating user", error: error.message});
    }
}

const deleteBlog =  async (req, res) => {
    const {id} = req.body;
    console.log(id);
    const data = await Blog.deleteOne({_id : id});
    res.json({message: "Blog deleted successfully !", data});
}

module.exports = {deleteBlog, updateBlog, getBlog, getAllBlogs};