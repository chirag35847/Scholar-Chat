const asyncHandler = require('express-async-handler')
const EmailToken = require('../models/emailTokenModel')
const User = require('../models/userModel')

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params

  const emailToken = await EmailToken.findOne({ token })

  if (!emailToken) {
    res.status(400)
    throw new Error('Invalid or expired email verification link')
  }

  const user = await User.findOne({ _id: emailToken.userId })

  if (!user) {
    res.status(402)
    throw new Error('User not found')
  }

  if (user.email.length === 0 || !user.email) {
    res.status(402)
    throw new Error('Email not Found in User Profile')
  }

  if (user.emailVerified) {
    res.status(202).json({
      message: 'Email verified already.',
    })
  }

  user.emailVerified = true

  await user.save()

  res.status(200).json({
    message: 'Email verified successfully. Please login to continue.',
  })
})
