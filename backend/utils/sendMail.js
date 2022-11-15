const nodemailer = require('nodemailer')
const { google } = require('googleapis')
require('dotenv').config()

const clientID = process.env.MAIL_CLIENT_ID
const clientSecret = process.env.MAIL_CLIENT_SECRET
const user = process.env.MAIL_EMAIL
const refreshToken = process.env.MAIL_REFRESH_TOKEN

const OAuth2 = google.auth.OAuth2
const OAuth2_client = new OAuth2(clientID, clientSecret)
OAuth2_client.setCredentials({
  refresh_token: refreshToken,
})

const sendMail = async (receipient, subject, text) => {
  const access_token = OAuth2_client.getAccessToken()
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: user,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: access_token,
    },
  })

  const mail_options = {
    from: user,
    to: receipient,
    subject: subject,
    text: text,
  }

  transport.sendMail(mail_options, (err, data) => {
    if (err) {
      console.log(err)
    } else {
    }
    transport.close()
  })
}

module.exports = sendMail
