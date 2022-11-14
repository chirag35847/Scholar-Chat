const mongoose = require('mongoose')

const Schema = mongoose.Schema

const forgotPasswordTokenSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    expiry: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'ForgotPasswordToken',
  forgotPasswordTokenSchema
)
