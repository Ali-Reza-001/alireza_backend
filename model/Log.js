const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: String, required: true },
  trip: [
    {
      method: String,
      url: String,
      timeElapsed: Number
    }
  ],
  device: { type: String, required: true },
},{ timestamps: true });

module.exports = mongoose.model('Log', logSchema);