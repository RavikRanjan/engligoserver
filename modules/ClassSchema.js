const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true,
    unique: true
  },
  status:{
    type:String,
    default: "Active"
  }
}, { timestamps: true });

const ClassItem = mongoose.model("classItem", ClassSchema);
module.exports = ClassItem;
