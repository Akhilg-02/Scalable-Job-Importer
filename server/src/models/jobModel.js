const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  description: { type: String },
  pubDate: { type: Date },
  link: { type: String },
  source: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
