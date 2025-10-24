const express = require("express");
const router = express.Router();
const Subject = require("../modules/SubjectSchema")
const multer = require("multer")
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

//for add subject item 
router.post("/", upload.single("pic"), async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject) {
      return res.status(400).json({ result: "Fail", message: "Subject name required!" });
    }
    if (!req.file) {
      return res.status(400).json({ result: "Fail", message: "Image required!" });
    }
    const newSubject = new Subject({
      subject,
      pic: req.file.path || req.file.secure_url
    });
    await newSubject.save();
    res.status(201).json({
      result: "Done",
      message: "Subject added successfully",
      data: newSubject
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "This Subject Name is Already Added!!!" });
    } else {
      res.status(500).json({ message: error.message, stack: error.stack })
    }
  }
});



//for get subject item 
router.get("/", async (req, res) => {
  try {
    var data = await Subject.find().sort({ _id: -1 })
    res.send({ result: "Done", Total: data.length, data: data })
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

//for get single subject item 
router.get("/:_id", async (req, res) => {
  try {
    var data = await Subject.findOne({ _id: req.params._id })
    if (data)
      res.send({ result: "Done", data: data })
    else
      res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

// For update subject Data
router.put("/:_id", upload.single("pic"), async (req, res) => {
  try {
    const data = await Subject.findById(req.params._id);
    if (!data) {
      return res.status(404).send({ result: "Fail", message: "No Record Found!!!" });
    }
    if (req.body.subject) {
      data.subject = req.body.subject;
    }
    if (req.file) {
      data.pic = req.file.path || req.file.secure_url || '';
    }
    await data.save();
    res.send({ result: "Done", message: "Record is Updated!!!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Subject name must be unique!!!" });
    } else {
      res.status(500).json({ message: error.message, stack: error.stack })
    }
  }
});


// For Delete subject Data
router.delete("/:_id", async (req, res) => {
  try {
    var data = await Subject.findOne({ _id: req.params._id })
    await data.deleteOne()
    res.send({ result: "Done", message: "Subject Record is Deleted!!!" })

  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

module.exports = router