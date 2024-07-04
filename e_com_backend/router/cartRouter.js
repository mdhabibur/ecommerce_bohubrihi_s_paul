const { getCartItem, createCartItem, updateCartItem, deleteCartItem } = require('../controllers/cartController')
const isAuthorized = require('../middlewares/isAuthorized')

const router = require('express').Router()


router.route('/')
        .get(isAuthorized, getCartItem)
        .post(isAuthorized, createCartItem)
        .put(isAuthorized, updateCartItem)


router.route('/:id')
        .delete(isAuthorized, deleteCartItem)

module.exports = router