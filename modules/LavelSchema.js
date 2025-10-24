// SubjectModel.js
const mongoose = require("mongoose");

const lavelSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  lavelname: { type: String, required: true },
  topicname: { type: String, required: true },
}, {
  timestamps: true
});

// Create a compound unique index (correct syntax)
lavelSchema.index(
  { subject: 1, lavelname: 1 },
  { unique: true} 
);

module.exports = mongoose.model("Level", lavelSchema);

