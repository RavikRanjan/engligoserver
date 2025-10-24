const express = require("express")
const Test = require("../modules/QuestionSchema")
const router = express.Router()

// For post Test Data
router.post("/", async (req, res) => {
    console.log("Payload received from client:", req.body);
    try {
        const payload = req.body;

        // If the payload is nested, extract the inner object
        const questionData = payload.setId?.question || payload;

        console.log("Processed Payload:", questionData); // Ensure the structure is correct

        const test = new Test(questionData);
        await test.save();
        res.status(201).json({ message: "Test added successfully" });
    } catch (error) {
        // console.log(error);
        if (error?.errors?.question?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.question.message });
        } else if (error?.errors?.option?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.option.message });
        } else if (error?.errors?.answer?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.answer.message });
        } else {

            res.status(500).send({ result: "Fail", message: "Internal Server Error" });
        }
    }
})

// All Test Get Data
router.get("/", async (req, res) => {
    try {
        var data = await Test.find().sort({ _id: -1 })
        res.send({ result: "Done", Total:data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

// For Single Test Id Get Data
router.get("/:_id", async (req, res) => {
    try {
        var data = await Test.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

// // For Update Test Data not required
router.put("/:_id", async (req, res) => {
    try {
        var data = await Test.findOne({ _id: req.params._id })
        if (data) {
            data.question = req.body.question ?? data.question
            data.options = req.body.options ?? data.options
            data.answer = req.body.answer ?? data.answer
            data.setId = req.body.setId ?? data.setId
            data.subject = req.body.subject ?? data.subject
            data.class = req.body.class ?? data.class
            data.topic = req.body.topic ?? data.topic
            data.time = req.body.time ?? data.time
            data.date = req.body.date ?? data.date
            data.status = req.body.status ?? data.status
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "No Record Found!!!" })
    } catch (error) {
            res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

// For Test Delete Data
router.delete("/:_id", async (req, res) => {
    try {
        var data = await Test.findOne({ _id: req.params._id })
        await data.deleteOne()
        res.send({ result: "Done", message: "Test Record is Deleted!!!" })

    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

module.exports = router