const express = require("express");
const router = express.Router();

const Lavel = require("../modules/LavelSchema");

// for add level
router.post('/', async (req, res) => {
  try {
    const { subject, lavelname } = req.body;

    const newLavel = new Lavel({ subject, lavelname });
    await newLavel.save();

    res.status(201).json({ message: "Lavel created successfully", data: newLavel });
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).json({ message: "This level already exists for the selected subject." });
    } else {
      res.status(500).json({ message: error.message, stack: error.stack })
    }
  }
});

//for get All level item
router.get("/", async (req, res) => {
  try {
    var data = await Lavel.find().sort({ _id: +1 })
    res.send({ result: "Done", Total: data.length, data: data })
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

//for get single level item 
router.get("/:_id", async (req, res) => {
  try {
    var data = await Lavel.findOne({ _id: req.params._id })
    if (data)
      res.send({ result: "Done", data: data })
    else
      res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

// For update level Data
router.put("/:_id", async (req, res) => {
  try {
    var data = await Lavel.findOne({ _id: req.params._id })
    if (data) {
      data.lavelname = req.body.lavelname ?? data.lavelname
      data.subject = req.body.subject ?? data.subject
      data.topicname = req.body.topicname ?? data.topicname
      await data.save()
      res.send({ result: "Done", message: "Record is Updated!!!" })
    }
    else
      res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Lavel name must be unique!!!." });
    } else {
      res.status(500).json({ message: "Server error", error: error });
    }
  }
})

// For Delete level Data
router.delete("/:_id", async (req, res) => {
  try {
    var data = await Lavel.findOne({ _id: req.params._id })
    await data.deleteOne()
    res.send({ result: "Done", message: "Level Record is Deleted!!!" })

  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

module.exports = router;

