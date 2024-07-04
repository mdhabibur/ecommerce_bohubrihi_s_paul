const express = require('express')
const isAuthorized = require('../middlewares/isAuthorized')
const isAdmin = require('../middlewares/isAdmin')
const { createCategory, getCategories } = require('../controllers/categoryController')
const validateJoi = require('../middlewares/validateJoi')
const { joiCategorySchema } = require('../models/Category')

const router = express.Router()


router.post('/', [isAuthorized, isAdmin], validateJoi(joiCategorySchema), createCategory)

router.get('/', getCategories)

module.exports = router