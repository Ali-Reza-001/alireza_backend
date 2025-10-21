// routes/projects.js
const express = require('express');
const router = express.Router();

const roles = require('../config/roles');
const verifyRole = require('../middleware/verifyRole');
const {deleteLog, getLog, getAllLogs, updateLog} = require('../controller/logsController');

// GET all Logs
router.get('/:id', verifyRole(roles.Admin, roles.User), getLog);

// GET a Log
router.get('/', verifyRole(roles.Admin), getAllLogs);

// ADD a new Log
router.post('/', async (req, res) => {
  res.json({message: 'Blank'});
});

// UPDATE a Log
router.put('/:id', verifyRole(roles.Admin), updateLog);

// DELETE a Log
router.delete('/', verifyRole(roles.Admin),deleteLog);

module.exports = router;