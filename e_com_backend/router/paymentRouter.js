const { initPayment, ipnHandler, ipnPaymentSuccessHandler } = require('../controllers/paymentController')
const isAuthorized = require('../middlewares/isAuthorized')


const router = require('express').Router()


router.route('/')
        .get(isAuthorized, initPayment)

router.route('/ipn')
        .post(ipnHandler)

router.route('/success')
        .post(ipnPaymentSuccessHandler)

module.exports = router