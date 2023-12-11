const express = require('express')
const bodyparser = require("body-parser")
const cors = require('cors')
const morgan = require('morgan')
const { connectMongoDB } = require("./connection/mongodb")
const { router } = require("./routes/index")
const { handler } = require("./middleware/execptionalHandling")
require('dotenv').config()
const app = express()
const port = 3000

connectMongoDB()

app.use(bodyparser.json({ limit: "50MB" }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors())
app.use(morgan("tiny"))

app.use("/api", router)

app.use(handler)

app.listen(port, () => console.log(`Example app listening on port ${port}`))