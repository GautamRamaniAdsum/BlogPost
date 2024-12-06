const express = require('express')
const bodyparser = require("body-parser")
const cors = require('cors')
const morgan = require('morgan')
const { connectMongoDB } = require("./connection/mongodb")
const { router } = require("./routes/index")
const { handler } = require("./middleware/execptionalHandling")
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const http = require('http');
const https = require('https');
const fs = require('fs');

connectMongoDB()

app.use(bodyparser.json({ limit: "50MB" }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors())
app.use(morgan("tiny"))

app.get("/health", (req, res) => {
    res.status(200).send({ status: "success", msg: "CI-CD SETUP" })
})

app.use("/api", router)

app.use(handler)

// let server = http.createServer(app);
// if (process.env.KEY || process.env.CERT) {
//     const HTTP_KEY = process.env.KEY;
//     const HTTP_CERT = process.env.CERT;
//     const KEY = fs.readFileSync(HTTP_KEY);
//     const CERT = fs.readFileSync(HTTP_CERT);
//     server = https.createServer({ key: KEY, cert: CERT },app);
// }

// server.listen(port, () => {
//     console.log(`server listening on ${port}`);
// });

let server;
if (process.env.KEY || process.env.CERT) {
    const HTTP_KEY = process.env.KEY;
    const HTTP_CERT = process.env.CERT;
    const KEY = fs.readFileSync(HTTP_KEY);
    const CERT = fs.readFileSync(HTTP_CERT);

    server = https.createServer({ key: KEY, cert: CERT }, app);
    console.log('HTTPS server started');
} else {
    server = http.createServer(app);
    console.log('HTTP server started');
}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


