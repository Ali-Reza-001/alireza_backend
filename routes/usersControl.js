// routes/projects.js
const express = require('express');
const router = express.Router();

const roles = require('../config/roles');
const verifyRole = require('../middleware/verifyRole');
const {deleteUser, getUser, getAllUsers, updateUser} = require('../controller/usersController');

// GET all Users
router.get('/:id', verifyRole(roles.Admin, roles.User), getUser);

// GET a User
router.get('/', verifyRole(roles.Admin), getAllUsers);

// ADD a new User
router.post('/', async (req, res) => {
  res.json({message: 'Blank'});
});

// UPDATE a User
router.put('/:id', verifyRole(roles.Admin), updateUser);

// DELETE a User
router.delete('/', verifyRole(roles.Admin),deleteUser);

module.exports = router;