// routes/projects.js
const express = require('express');
const router = express.Router();

const roles = require('../config/roles');
const verifyRole = require('../middleware/verifyRole');
const {deleteBlog, getBlog, getAllBlogs, updateBlog} = require('../controller/blogsController');

// GET a Blog
router.get('/:id', getBlog);

// GET all Blogs
router.get('/', getAllBlogs);

// ADD a new Blog
router.post('/', async (req, res) => {
  res.json({message: 'Blank'});
});

// UPDATE a Blog
router.put('/:id', verifyRole(roles.Admin), updateBlog);

// DELETE a Blog
router.delete('/', verifyRole(roles.Admin),deleteBlog);

module.exports = router;