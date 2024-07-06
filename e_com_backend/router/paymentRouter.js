const { initPayment, ipnHandler } = require('../controllers/paymentController')
const isAuthorized = require('../middlewares/isAuthorized')


const router = require('express').Router()


router.route('/')
        .get(isAuthorized, initPayment)

router.route('/ipn')
        .post(ipnHandler)

module.exports = router