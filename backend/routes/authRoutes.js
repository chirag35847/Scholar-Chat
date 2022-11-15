const express = require('express')
const router = express.Router()

const { verifyEmail } = require('../controllers/authControllers')

router.get('/email/verify/:token', verifyEmail)

module.exports = router
