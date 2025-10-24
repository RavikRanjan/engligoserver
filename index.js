const express = require('express')
const cors = require('cors')
require("dotenv").config();
const app = express()

// Import Routes
const lavelRoutes = require('./routes/LavelRoutes');
const subjectRoutes = require('./routes/SubjectRoutes');
const classRoutes = require('./routes/ClassRoute');
const userRoutes = require('./routes/UserRoute');
const resultRoutes = require('./routes/ResultRoutes')
const testRoutes = require('./routes/QuestionRoute')

app.use(cors({ origin: '*' }));
app.use(express.json());

const database = require("./dbConnect")

app.use("/api/lavel",lavelRoutes)
app.use("/api/subject",subjectRoutes)
app.use("/api/classItem",classRoutes)
app.use("/api/user",userRoutes)
app.use("/api/result",resultRoutes)
app.use("/api/test",testRoutes)

const port = process.env.PORT || 80;

app.listen(port,()=>{
    console.log(`Server is Running at Port http://localhost:${port}`)
})