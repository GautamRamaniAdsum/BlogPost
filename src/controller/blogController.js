const { Blog } = require("../model/blogModel");
const { User } = require("../model/userModel");
const { validateCreateBlog, validateUpdateBlog, validateRemoveBlog } = require("../validation/blogValidation")

async function creatBlog(req, res) {
    try {
        const data = req.body;
        const { error, value: payload } = await validateCreateBlog(data)
        if (error) {
            return res.send({ data: {}, status: "false", msg: error.details[0].message })
        } else {

            const userId = req.user.id;

            let createBlog = await Blog.create({
                title: payload.title,
                post: payload.post,
                author: payload.author ? payload.author : "",
                userId: userId
            })
            return res.status(200).send({ data: createBlog, status: "success", msg: "Blog created successfully" })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

async function updateBlog(req, res) {
    try {
        const data = req.body;
        const { error, value: payload } = await validateUpdateBlog(data)
        if (error) {
            return res.send({ data: {}, status: "false", msg: error.details[0].message })
        } else {

            const isBlog = await Blog.findOne({ title: payload.title })
            if (isBlog) {

                const updateBlog = await Blog.findOneAndUpdate({ _id: isBlog._id }, {
                    $set: {
                        post: payload.post ? payload.post : isBlog.post,
                        author: payload.author ? payload.author : isBlog.post
                    }
                })
                return res.status(200).send({ data: updateBlog, status: "success", msg: "blog updated successfully" })
            } else {
                return res.status(400).send({ data: {}, status: "false", msg: "Email does not exist" })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

async function getBlog(req, res) {
    try {
        const userId = req.user.id;

        const user = await User.findOne({ _id: userId })
        if (user) {

            const blog = await Blog.find({ userId: userId })
            return res.status(200).send({ data: blog, status: "success", msg: "blog has been fetched successfully" })

        } else {
            return res.status(400).send({ data: {}, status: "false", msg: "User does not exist" })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

async function removeBlog(req, res) {
    try {
        const data = req.body;
        const userId = req.user.id;

        const { error, value: payload } = await validateRemoveBlog(data)
        if (error) {
            return res.send({ data: {}, status: "false", msg: error.details[0].message })
        } else {

            const user = await User.findOne({ _id: userId })
            if (user) {

                const isBlog = await Blog.findOne({ title: payload.title, userId: user._id })

                if (isBlog) {

                    await Blog.findOneAndDelete({ _id: isBlog._id })
                    return res.status(200).send({ data: {}, status: "success", msg: "Blog has been deleted successfully" })
                } else {
                    return res.status(400).send({ data: {}, status: "false", msg: "Blog not found" })
                }
            } else {
                return res.status(400).send({ data: {}, status: "false", msg: "User does not exist" })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

async function getBlogCustom(req, res) {
    try {
        const { page, limit } = req.body;
        const userId = req.user.id;

        const user = await User.findOne({ _id: userId })
        if (user) {

            const count = await Blog.countDocuments({})
            const blog = await Blog.find({}).limit(limit * 1).skip((page - 1) * limit)

            let data = {
                blog: blog,
                totalDocs: count,
                page: Math.ceil(count / limit),
                currentPage: page
            }
            return res.status(200).send({ data: data, status: "success", msg: "Blog has been fetched successfully" })

        } else {
            return res.status(400).send({ data: {}, status: "false", msg: "User does not exist" })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

async function getBlogV2(req, res) {
    try {
        const { page, limit } = req.body;
        const userId = req.user.id;

        const user = await User.findOne({ _id: userId })
        if (user) {

            let options = {
                page: page || 1,
                limit: limit || 10
            }

            const blog = await Blog.paginate({}, options)
            return res.status(200).send({ data: blog, status: "success", msg: "Blog has been fetched successfully" })

        } else {
            return res.status(400).send({ data: {}, status: "false", msg: "User does not exist" })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: {}, status: "false", msg: "something went wrong" })
    }
}

module.exports = { creatBlog, updateBlog, getBlog, removeBlog, getBlogCustom, getBlogV2 }