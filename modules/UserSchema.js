const mongoose = require("mongoose")
const validator = require("validator")

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

const User = new mongoose.model("User", userSchema)

module.exports = User