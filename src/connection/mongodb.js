const mongoose = require("mongoose")
require('dotenv').config()
async function connectMongoDB() {
    try {
        const url = process.env.MONGO_SRV
        await mongoose.connect(url);
        console.log("Mongodb connection established");
    } catch (error) {
        console.log(error);
    }
}
module.exports = { connectMongoDB }