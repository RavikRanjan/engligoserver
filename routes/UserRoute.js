const express = require("express")
const multer = require("multer")
const User = require("../modules/UserSchema")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passwordValidator = require("password-validator")

const nodemailer = require("nodemailer")
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        resource_type: "auto",
    },
});

const upload = multer({ storage });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "rk197146@gmail.com",
        pass: "cywe lxsn deto zxdg"
    }
})

// password schema
var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(16)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Password', 'Password123']); // Blacklist these values



const router = express.Router()

// For post User Data
router.post("/", async (req, res) => {
    var data = new User(req.body)
    // console.log("Request Body:", req.body); // Check incoming dat
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error)
                res.send({ result: "Fail", message: "Internal Server Error while Creating Hash Password" })
            else {
                data.password = hash
                try {
                    await data.save()
                    res.send({ result: "Done", count: data.length, message: "Record is Created!!!", data: data })
                }
                catch (error) {
                    console.error("Server Error:", error);
                    if (error.keyValue)
                        res.status(400).send({ result: "Fail", message: "This Mobile Number is Already Register!!!" })
                    else if (error.errors.name)
                        res.status(400).send({ result: "Fail", message: error.errors.name.message })
                    else if (error.errors.mobile)
                        res.status(400).send({ result: "Fail", message: error.errors.mobile.message })
                    else if (error.errors.password)
                        res.status(400).send({ result: "Fail", message: error.errors.password.message })
                    else
                        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
                }
            }
        })
    }
    else {
        res.status(400).send({ result: "Fail", message: "Password length Must Be on Minimum 8 and Maximum 16 also include 1 uppercase 1 lowercase and 1 characters!!!" })
    }
})

// All User Get Data
router.get("/", async (req, res) => {
    try {
        var data = await User.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})
router.get("/", async (req, res) => {
    try {
        var data = await User.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

// For Single User Id Get Data
router.get("/:userid", async (req, res) => {
    try {
        var data = await User.findOne({ _id: req.params.userid }); // Use userid
        if (data)
            res.send({ result: "Done", data: data });
        else
            res.status(404).send({ result: "Fail", message: "No Record Found!!!" });
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error Nisha" });
    }
});

// For Single User Id Get Data
router.get("/admin/:uerid", async (req, res) => {
    try {
        var data = await User.findOne({ _id: req.params.uerid })
        if (data)
            res.send({ result: "Done", count: data.length, data: data })
        else
            res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

// For Update User Data not required
// UPDATE USER
router.put("/:_id", upload.single("pic"), async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ result: "Fail", message: "User Not Found" });
    }

    // Basic fields update
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.password = req.body.password ?? user.password;
    user.class = req.body.class ?? user.class;
    user.otp = req.body.otp ?? user.otp;
    user.role = req.body.role ?? user.role;
    user.status = req.body.status ?? user.status;
    if (req.file) {
            user.pic = req.file.path || req.file.secure_url || '';
        }
    await user.save();
    res.status(200).json({
      result: "Done",
      message: "User Updated Successfully",
      updatedUser: user
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ result: "Fail", message: "Email Must be Unique!" });
    }
    res.status(500).json({ result: "Fail", message: error.message });
  }
});

// For User Delete Data
router.delete("/:_id", async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.params._id });

        if (!data) {
            return res.status(404).send({ result: "Fail", message: "User not found!" });
        }
        try {
            if (data.pic) {
                const publicId = data.pic.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`uploads/${publicId}`);
            }
        } catch (error) {
            console.error("Error deleting image from Cloudinary:", error.message);
        }
        await data.deleteOne();
        res.send({ result: "Done", message: "User Record is Deleted!!!" });

    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
});


//for login
router.post("/login", async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) return res.status(404).send({ result: "Fail", message: "Invalid Username or Password!!!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).send({ result: "Fail", message: "Invalid Username or Password!!!" });

        const secretKey = user.role === "Admin" ? process.env.SAULTKEYADMIN : process.env.SAULTKEYUSER;

        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "2h" });

        res.send({ result: "Done", message: "Login successful!", token, data: user });
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!", error: error.message });
    }
});

// For forget Password
router.post("/forgetpassword-1", async (req, res) => {
    try {
        var data = await User.findOne({ mobile: req.body.mobile })
        if (data) {
            if (!data.email) {
                return res.status(400).send({
                    result: "Fail",
                    message: "Please update your profile with a valid email Id to reset your password..."
                })
            }
            const num = parseInt(Math.random() * 1000000 % 1000000)
            const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Set expiration time to 5 minutes from now
            data.otp = num;
            data.otpExpiry = otpExpiry;
            await data.save()
            let mailOption = {
                from: "rk197146@gmail.com",
                to: data.email,
                subject: "OTP for Password Reset",
                text: `Hello ${data.name}\nPlease enter the following code on the Password Reset.\nYour code is : ${num}\n\nTeam\nAdarsh Coaching Center\n`
            }
            transporter.sendMail(mailOption, (error, data) => {
                if (error)
                    console.log(error);
            })
            res.send({ result: "Done", message: "OTP Sent on Your Registered Email" })
        }
        else {
            res.status(401).send({ result: "Fail", message: "Invalid Username and Password" })
        }
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
    }
})

router.post("/forgetpassword-2", async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const data = await User.findOne({ mobile });

        if (data) {
            if (parseInt(data.otp) === parseInt(otp) && new Date(data.otpExpiry) > new Date()) {
                console.log("OTP verified successfully!");
                data.otp = null;
                data.otpExpiry = null;
                await data.save();

                return res.send({ result: "Done", message: "OTP Verified Successfully!" });
            }

            if (new Date(data.otpExpiry) <= new Date()) {
                return res.status(401).send({ result: "Fail", message: "OTP has expired. Please request a new one." });
            }

            return res.status(401).send({ result: "Fail", message: "Worng OTP.Plese Enter Valid OTP!!!" });
        } else {
            return res.status(401).send({ result: "Fail", message: "User not found." });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
    }
});

router.post("/forgetpassword-3", async (req, res) => {
    try {
        var data = await User.findOne({ mobile: req.body.mobile })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error)
                        res.send({ result: "Fail", message: "Internal Server Error while Creating Hash Password" })
                    else {
                        data.password = hash
                        try {
                            await data.save()
                            res.send({ result: "Done", count: data.length, message: "Password has been Reset Successfully!!!" })
                        }
                        catch (error) {
                            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
                        }
                    }
                })
            }
            else {
                res.status(400).send({ result: "Fail", message: "Password length Must Be on Minimum 8 and Maximum 16 also include 1 uppercase 1 lowercase characters" })
            }
        }
        else {
            res.status(401).send({ result: "Fail", message: "UnAuthorization User, Username not Found!!!" })
        }
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})

router.post("/changepassword", async (req, res) => {
    try {
        const { mobile, oldpwd, newpwd } = req.body;
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(401).send({ result: "Fail", message: "Unauthorized user, username not found!" });
        }
        const isPasswordMatch = await bcrypt.compare(oldpwd, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ result: "Fail", message: "Old password is incorrect!" });
        }
        if (!schema.validate(newpwd)) {
            return res.status(400).send({
                result: "Fail",
                message: "Password length must be between 8-16 characters and include 1 uppercase and 1 lowercase character.",
            });
        }
        const hashedPassword = await bcrypt.hash(newpwd, 12);
        user.password = hashedPassword;
        await user.save();
        res.send({ result: "Done", message: "Password has been changed successfully!" });
    } catch (error) {
        console.error("Error in changepassword API:", error);
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await verifyIdToken(idToken);
        res.status(200).send({ success: true, user: decodedToken });
    } catch (error) {
        res.status(401).send({ success: false, message: "Invalid token" });
    }
});

// Search router

router.post("/search", async (req, res) => {
    try {
        var data = await User.find({
            $or: [
                { name: { $regex: `.*${req.body.search}.*`, $options: "i" } },
                { email: { $regex: `.*${req.body.search}.*`, $options: "i" } },
                { class: { $regex: `.*${req.body.search}.*`, $options: "i" } },
                { status: { $regex: `.*${req.body.search}.*`, $options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$mobile" },
                            regex: `.*${req.body.search}.*`,
                        },
                    },
                },

            ]
        })
        res.send({ result: "Done", Total: data.length, data: data })
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
    }
})


module.exports = router
