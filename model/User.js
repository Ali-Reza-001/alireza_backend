// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ip: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  refresh: { type: Array, required: true },
  role: { type: Array, default: ['user'] }
});

module.exports = mongoose.model('User', userSchema);