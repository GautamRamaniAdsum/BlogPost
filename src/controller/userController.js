const { User } = require("../model/userModel");
const jwt = require('jsonwebtoken');
const { validateSignup, validateLogin } = require("../validation/userValidation")

async function signUp(req, res) {
    try {
        const data = req.body;
        const { error, value: payload } = await validateSignup(data)
        if (error) {
            return res.send({ data: {}, status: "false", msg: error.details[0].message })
        } else {

            const user = await User.findOne({ email: payload.email })
            if (!user) {
                let createUser = await User.create({
                    name: payload.name,
                    email: payload.email,
                    password: payload.password
                })
                return res.status(200).send({ data: createUser, status: "success", msg: "User register successfully" })
            } else {
                return res.status(400).send({ data: {}, status: "false", msg: "User already exist" })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        const { error, value: payload } = await validateLogin(data)
        if (error) {
            return res.send({ data: {}, status: "false", msg: error.details[0].message })
        } else {

            const user = await User.findOne({ email: payload.email })
            if (user) {

                const isPassword = await User.findOne({ password: payload.password })

                if (isPassword) {

                    const secret= process.env.SECRET
                    let accessToken = jwt.sign({ id: isPassword._id }, secret);

                    await User.findOneAndUpdate({ email: isPassword.email },
                        {
                            $set: {
                                token: accessToken
                            }
                        })
                    const data = {
                        name: isPassword.name,
                        token: accessToken
                    }
                    return res.status(200).send({ data: data, status: "success", msg: "User login successfully" })
                } else {
                    return res.status(400).send({ data: {}, status: "false", msg: "Password does not match" })
                }
            } else {
                return res.status(400).send({ data: {}, status: "false", msg: "Email does not exist" })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

module.exports = { signUp, login }