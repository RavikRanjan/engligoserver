const mongoose = require("mongoose")

const TestSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question Must be Required!!!"],
    },
    option: {
        type: mongoose.Schema.Types.Mixed, // Allows any type
        required: [true, "Option Must Be Required!!!"],
    },
    answer: {
        type: String,
        required: [true, "Answer Must be Required"],
    },
    setId: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
    },
    lavelname:{
        type:String,
    },
    class: {
        type: String,
        default: ""
    },
    topic: {
        type: String,
        default: ""
    },
    time: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: () => new Date().toISOString()
    },
    status: {
        type: String,
        default: "Active"
    }
});


const Test = new mongoose.model("test", TestSchema)

module.exports = Test