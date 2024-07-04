const express = require('express')
const { signup, signin } = require('../controllers/userController')
const validateJoi = require('../middlewares/validateJoi')
const { loginSchema, signUpSchema } = require('../models/User')
const router = express.Router()




router.post('/signup', validateJoi(signUpSchema), signup)
router.post('/signin', validateJoi(loginSchema), signin)


module.exports = router