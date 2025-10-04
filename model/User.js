// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userProfilePic: { type: String },
  ipInfo: { type: Object },
  emailVerified: { type: Boolean, default: false },
  refresh: { type: Array },
  role: { type: Array, default: [9009] }
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);