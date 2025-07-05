const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  importDateTime: { type: Date, default: Date.now },
  total: { type: Number, default: 0 },
  new: { type: Number, default: 0 },
  updated: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  failedJobs: [
    {
      guid: String,
      reason: String
    }
  ]
});

module.exports = mongoose.model('ImportLog', importLogSchema);
