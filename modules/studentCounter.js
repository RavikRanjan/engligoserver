const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const StudentCounter = new mongoose.model("StudentCounter", counterSchema);

module.exports = StudentCounter
