const { User } = require("../model/userModel");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    try {

        const token = req.headers.authorization;
        if (!token) {
            next(new Error("Provide token!!"))
        }
        const secret = process.env.SECRET
        const decode = jwt.verify(token, secret);

        let user = await User.findOne({ _id: decode.id })
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        next(new Error("Auth Fail"))
    }
}
module.exports = { auth }