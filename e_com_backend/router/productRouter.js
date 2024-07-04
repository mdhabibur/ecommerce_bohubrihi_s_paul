const express = require('express')
const isAuthorized = require('../middlewares/isAuthorized')
const isAdmin = require('../middlewares/isAdmin')
const { addProduct, getProducts,getPhoto, getProductById, updateProductById, filterProducts } = require('../controllers/productController')
const validateJoi = require('../middlewares/validateJoi')
const { joiProductSchema } = require('../models/Product')


const router = express.Router()

router.post('/', [isAuthorized, isAdmin], addProduct)
router.get('/', getProducts)

router.get('/:id', getProductById)
router.put('/:id', [isAuthorized, isAdmin], updateProductById)

router.get('/photo/:id', getPhoto)
router.post('/filter', filterProducts)


module.exports = router