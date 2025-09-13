// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  techStack: [String],
  imageUrl: String,
  liveUrl: String,
  repoUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports= mongoose.model('Project', projectSchema);