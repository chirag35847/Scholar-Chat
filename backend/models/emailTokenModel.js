const mongoose = require('mongoose')
const emailToken = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const EmailToken = mongoose.model('EmailToken', emailToken)

module.exports = EmailToken
