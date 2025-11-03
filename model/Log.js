const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  ipInfo: { type: Object, required: true },
  method: { type: String, required: true },
  url: { type: String, required: true },
  device: { type: String, required: true },
},{ timestamps: true });

module.exports = mongoose.model('Log', logSchema);