const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    unique: true
  },
  pic:{
    type: String,
    default:""
  },
  status:{
    type:String,
    default: "Active"
  }
}, { timestamps: true });

const Subject = mongoose.model("subject", SubjectSchema);
module.exports = Subject;
