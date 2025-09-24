// routes/projects.js
const express = require('express');
const router = express.Router();

const roles = require('../config/roles');
const verifyRole = require('../middleware/verifyRole');
const {deleteUser, getUser} = require('../controller/usersController');

// GET all projects
router.get('/:id', verifyRole(roles.Admin), getUser);

// POST a new project
router.post('/', async (req, res) => {
  res.json({message: 'Blank'});
});

// POST a new project
router.put('/', async (req, res) => {
  res.json({message: 'Blank'});
});

// POST a new project
router.delete('/', verifyRole(roles.Admin),deleteUser);

module.exports = router;