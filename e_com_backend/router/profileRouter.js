const { getProfile, setProfile } = require('../controllers/profileController')
const isAuthorized = require('../middlewares/isAuthorized')


const router = require('express').Router()


router.route('/')
        .get(isAuthorized, getProfile)
        .post(isAuthorized, setProfile)

module.exports = router