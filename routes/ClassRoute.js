const express = require("express");
const router = express.Router();
const ClassItem = require("../modules/ClassSchema")

//for add class item 
router.post("/addClass",async(req , res)=>{
  try {
      const {classname} = req.body;
      const newClassItem = new ClassItem({classname})

      await newClassItem.save();
      res.status(200).json({message:"Class is Add Sucessfully!!!",data: newClassItem});
  } catch (err) {
    if(err.code === 11000){
      res.status(400).json({message:"This class name Already Exists!!!"})
    }else{
      res.status(500).json({message:"Server error",error: err})
    }
  }
})

//for get class item 
router.get("/", async (req, res) => {
    try {
        var data = await ClassItem.find().sort({ _id: -1 })
        res.send({ result: "Done", Total:data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

//for get single class item 
router.get("/:_id", async (req, res) => {
  try {
    var data = await ClassItem.findOne({ _id: req.params._id })
    if (data)
      res.send({ result: "Done", data: data })
    else
      res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

// For update class Data
router.put("/:_id", async (req, res) => {
  try {
    var data = await ClassItem.findOne({ _id: req.params._id })
    if (data) {
      data.classname = req.body.classname ?? data.classname
      await data.save()
      res.send({ result: "Done", message: "Record is Updated!!!" })
    }
    else
      res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Class name must be unique!!!." });
    } else {
      res.status(500).json({ message: "Server error", error: error });
    }
  }
})

// For Delete class Data
router.delete("/:_id", async (req, res) => {
  try {
    var data = await ClassItem.findOne({ _id: req.params._id })
    await data.deleteOne()
    res.send({ result: "Done", message: "Class Record is Deleted!!!" })

  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error" });
  }
})

module.exports = router