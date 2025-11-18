const mongoose = require("mongoose")
const validator = require("validator")
const StudentCounter = require("./studentCounter");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be required!!!"],
    },
    mobile: {
        type: String,
        required: [true, "Mobile Must Required!!!"],
        unique: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: "Please enter a valid 10-digit mobile number"
        }
    },
    email: {
        type: String,
        default: "",
        required: false,
    },
    password: {
        type: String,
        required: [true, "Password must be required!!!"],
        unique: false
    },
    class: {
        type: String,
        default: ""
    },
     studentId: {
        type: String,
        default: ""
    },
    studentId: {
        type: String,
        unique: true
    },
    pic: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: "-11551"
    },
    otpExpiry: {
        type: String,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User" 
    },
    status: {
        type: String,
        default: "Active"
    },
    fileName: String,
    fileType: String,
    fileUrl: String,
})
userSchema.pre("save", async function (next) {
    if (this.studentId) {
        return next();
    }
    let category = "";

    if (this.class === "Graduation") {
        category = "GR";
    } else if (!isNaN(this.class) && this.class !== "") {
        category = `C${this.class}`;
    } else {
        category = "C0"; 
    }

    const counter = await StudentCounter.findOneAndUpdate(
        { category },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const number = counter.seq.toString().padStart(5, "0");

    this.studentId = `${category}-${number}`;

    next();
});
const User = new mongoose.model("User", userSchema)

module.exports = User
