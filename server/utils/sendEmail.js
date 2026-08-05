const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, text, html }) => {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.FROM_EMAIL || (user ? user : 'no-reply@campus-hub.local')

  if (!host || !port || !user || !pass) {
    // fallback: log to console for local development
    console.log('--- sendEmail fallback ---')
    console.log('To:', to)
    console.log('Subject:', subject)
    if (text) console.log('Text:', text)
    if (html) console.log('HTML:', html)
    console.log('--- end fallback ---')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({ from, to, subject, text, html })
}

module.exports = sendEmail
