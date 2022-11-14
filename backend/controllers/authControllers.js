const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const ForgotPasswordToken = require('../models/forgotPasswordTokenModel')

const EXPIRY_DURATION = 1000 * 60 * 60 * 1 // 1 hour

exports.forgotPasswordGenerateToken = asyncHandler(async (req, res, next) => {
  const { orcid } = req.body // get the orcid from the request body

  // check if orcid is in the body
  if (!orcid) {
    res.status(400)
    throw new Error('Orcid not sent with request')
  }

  const user = await User.findOne({ orcid }) // check if user exists with the given orcid

  if (!user) {
    res.status(404)
    throw new Error('User does not exist')
  }

  // find the token with the given orcid
  const reqExists = await ForgotPasswordToken.findOne({ userID: user._id })

  // check if the token is already created within 5 minutes
  if (
    reqExists &&
    new Date(new Date(reqExists.createdAt)).getTime() >
      new Date(Date.now() - 1000 * 60 * 5).getTime()
  ) {
    res.status(422)
    throw new Error(
      'Request already exists. Please wait for a few minutes to request again'
    )
  } else if (reqExists) {
    await ForgotPasswordToken.findByIdAndDelete(reqExists._id)
  }

  const expiry = Date.now() + EXPIRY_DURATION

  // create a new token
  const forgotPasswordToken = new ForgotPasswordToken({
    userID: user._id,
    expiry,
  })

  await forgotPasswordToken.save()

  //send email here

  return res.status(200).json({
    message: 'Token generated! Please check your email.',
  })
})

exports.verifyForgotPasswordToken = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body // get the token and password from the request body

  const forgotPasswordToken = await ForgotPasswordToken.findById(token)

  if (!forgotPasswordToken) {
    res.status(404)
    throw new Error('Token not found')
  }

  // check if the token is expired
  if (forgotPasswordToken.expiry < Date.now()) {
    res.status(422)

    await ForgotPasswordToken.findByIdAndDelete(token)
    throw new Error('Token expired')
  }

  const user = await User.findById(forgotPasswordToken.userID)

  if (user) {
    user.password = password
    await user.save()

    await ForgotPasswordToken.findByIdAndDelete(token)

    return res.status(200).json({
      message: 'Password updated',
    })
  }

  res.status(404)
  throw new Error('User not found')
})
