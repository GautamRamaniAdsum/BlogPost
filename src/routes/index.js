const express = require('express')
const multer = require('multer')
const router = express()
const { signUp, login, addProfileImage } = require("../controller/userController")
const { auth } = require("../middleware/auth")
const upload = multer({ storage: multer.memoryStorage() })
const { creatBlog, updateBlog, getBlog, removeBlog, getBlogCustom, getBlogV2 } = require("../controller/blogController")

//user
router.post("/signUp", signUp)
router.post("/login", login)

router.post("/profileImage",auth, upload.single('profileImage'), addProfileImage)

//blog
router.post("/creatBlog", auth, creatBlog)
router.post("/updateBlog", auth, updateBlog)
router.post("/getBlog", auth, getBlog)
router.post("/removeBlog", auth, removeBlog)
router.post("/getBlogCustom", auth, getBlogCustom)
router.post("/getBlogV2", auth, getBlogV2)

module.exports = { router }