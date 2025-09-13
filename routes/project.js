// routes/projects.js
const express = require('express');
const Project = require('../model/Projects.js');

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// POST a new project
router.post('/', async (req, res) => {
  const newProject = new Project(req.body);
  await newProject.save();
  res.status(201).json(newProject);
});

module.exports = router;