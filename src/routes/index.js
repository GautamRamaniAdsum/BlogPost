const express = require('express')
const router = express()
const { signUp, login } = require("../controller/userController")
const { auth } = require("../middleware/auth")
const { creatBlog, updateBlog, getBlog, removeBlog, getBlogCustom, getBlogV2 } = require("../controller/blogController")

//user
router.post("/signUp", signUp)
router.post("/login", login)

//blog
router.post("/creatBlog", auth, creatBlog)
router.post("/updateBlog", auth, updateBlog)
router.post("/getBlog", auth, getBlog)
router.post("/removeBlog", auth, removeBlog)
router.post("/getBlogCustom", auth, getBlogCustom)
router.post("/getBlogV2", auth, getBlogV2)

module.exports = { router }