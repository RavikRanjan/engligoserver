const express = require("express")
const Result = require("../modules/ResultSchem")
const fs = require("fs")

const router = express.Router()
const mongoose = require("mongoose");
// For Submit Result Data
router.post("/", async (req, res) => {
    try {
        const data = new Result(req.body)
        await data.save()
        res.send({ result: "Done", message: "Record is Created!!!", data: data })
    } catch (error) {
        if (error?.keyValue) {
            res.status(400).send({ result: "Fail", message: "Result Name Must Unique!!!" });
        } else if (error?.errors?.totalQuestions?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.totalQuestions.message });
        } else if (error?.errors?.topic?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.topic.message });
        } else if (error?.errors?.totalAttempted?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.totalAttempted.message });
        } else if (error?.errors?.totalMarks?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.totalMarks.message });
        } else if (error?.errors?.Subject?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.Subject.message });
        } else if (error?.errors?.timeTaken?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.timeTaken.message });
        }else if (error?.errors?.setId?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.setId.message });
        }else if (error?.errors?.userid?.message) {
            res.status(400).send({ result: "Fail", message: error.errors.userid.message });
        } else {
            console.log(error)
            res.status(500).send({ result: "Fail", message: "Internal Server Errordd" });
        }
    }
})

// For All Result Get Data
router.get("/", async (req, res) => {
    try {
        var data = await Result.find().sort({ _id: -1 })
        res.send({ result: "Done", Total:data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

// For userid Result Get Data
router.get("/user/:userid", async (req, res) => {
    try {
        const userId = req.params.userid;
        const results = await Result.find({ userid: userId });

        if (!results.length) {
            return res.status(404).json({ result: "Fail", message: "No test results found" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching test results:", error);
        res.status(500).json({ result: "Fail", message: "Internal Server Error" });
    }
});


// For Single Result Id Get Data
router.get("/:_id", async (req, res) => {
    try {
        // Validate if the provided _id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
            return res.status(400).send({ result: "Fail", message: "Invalid ID format" });
        }

        // Convert the string _id to an ObjectId
        const objectId = new mongoose.Types.ObjectId(req.params._id);

        // Fetch the data
        const data = await Result.findOne({ _id: objectId });

        if (data) {
            res.send({ result: "Done", data: data });
        } else {
            res.status(404).send({ result: "Fail", message: "No Record Found!!!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
});

// For Result Delete Data
router.delete("/:_id", async (req, res) => {
    try {
        var data = await Result.findOne({_id: req.params._id})
        try {
            fs.unlinkSync(`public/product/${data.pic}`)
        } catch (error) {}
        await data.deleteOne()
        res.send({ result: "Done", message: "Result Record is Deleted!!!" })

    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" });
    }
})

module.exports = router