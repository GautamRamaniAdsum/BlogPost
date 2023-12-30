const { User } = require("../model/userModel");
const jwt = require('jsonwebtoken');
const { validateSignup, validateLogin } = require("../validation/userValidation")
const { USER_CONSATNT } = require("../constant/userConstant")
const { validateFile } = require("../utils/validation")
const { uploadToS3 } = require("../utils/s3")

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

                    const secret = process.env.SECRET
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

async function addProfileImage(req, res, next) {
    try {
        const file = req.file;
        const userId = req.user.id;
        const maxSize = USER_CONSATNT.USER_PROFILE_IMAGE_FILE_SIZE;

        // validate avatarImage file
        await validateFile(req, file, 'profileImage', USER_CONSATNT.USER_PROFILE_IMAGE_EXT_ARRAY, maxSize, next);

        // Check is user exists or not
        console.log("userId::", userId);
        let user = await User.findOne({ _id: userId })
        console.log("user::", user);
        if (user) {

            let isProfileImageExists = await User.findOne({ profileImage: { $exists: true } })

            if (!isProfileImageExists) {
                const uploadResult = await uploadToS3(file, 'ProfileImages');

                let profileImage = await User.findByIdAndUpdate({ _id: userId }, {
                    $set: {
                        profileImage: uploadResult.Location
                    }
                }, { new: true })
                return res.status(200).send({ data: profileImage, status: "success", msg: "User profile image added successfully" })
            } else {
                return res.status(400).send({ data: {}, status: "false", msg: "Profile image already exist" })
            }

        } else {
            return res.status(400).send({ data: {}, status: "false", msg: "User does not exist" })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

module.exports = { signUp, login, addProfileImage }