const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorID: { type: String, required: true },
  imageUrl: { type: String, required: true },
  hasPublished: { type: Boolean, default: false },
},  { timestamps: true});

module.exports= mongoose.model('Blog', blogSchema);