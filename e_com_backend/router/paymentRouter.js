const { initPayment, ipnHandler, ipnPaymentSuccessHandler, ipnPaymentFailureHandler, ipnPaymentCancelHandler } = require('../controllers/paymentController')
const isAuthorized = require('../middlewares/isAuthorized')


const router = require('express').Router()


router.route('/')
        .get(isAuthorized, initPayment)

router.route('/ipn')
        .post(ipnHandler)

router.route('/success')
        .post(ipnPaymentSuccessHandler)

router.route('/fail')
        .post(ipnPaymentFailureHandler)

 router.route('/cancel')
        .post(ipnPaymentCancelHandler)

module.exports = router