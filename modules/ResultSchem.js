const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    setId: { type: mongoose.Schema.Types.ObjectId, ref: "TestSet", required: true },
    totalQuestions: { type: Number, required: true },
    topic: { type: String, required: true },
    totalAttempted: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    subject: { type: String, required: true },
    timeTaken: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Active" },
    attemptedQuestions: [
        {
            questionId: String,
            question: String,
            correctAnswer: String,
            userAnswer: String,
            isCorrect: Boolean,
            options: [String],
        }
    ]
},);

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
