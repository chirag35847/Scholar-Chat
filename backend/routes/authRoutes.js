const express = require('express')
const router = express.Router()

const controller = require('../controllers/authControllers')

router.post('/forgotpassword', controller.forgotPasswordGenerateToken)
router.post('/forgotpassword/verify', controller.verifyForgotPasswordToken)

module.exports = router
