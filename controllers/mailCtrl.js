'use strict'

const nodemailer = require('nodemailer')
const config = require('../config')
const { validateFields } = require('./utils')

exports.sendEmail = async function sendEmail (req, res) {
  if (!validateFields(req, res, ['correo'])) {
    return
  }

  if (!config.mail.user || !config.mail.pass) {
    return res.status(500).send({ message: 'El servicio de correo no está configurado' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: config.mail.service,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass
      }
    })

    const emailToken = req.body.emailToken || ''
    const url = emailToken
      ? `${config.appUrl}/generatepassword?token=${encodeURIComponent(emailToken)}`
      : `${config.appUrl}/generatepassword`

    await transporter.sendMail({
      from: config.mail.user,
      to: req.body.correo,
      subject: 'Bienvenido a Cashin!',
      html: `Bienvenido a Cashin, verifique su correo haciendo click <a href="${url}">aquí</a> para activar tu cuenta`
    })

    console.log('Email enviado')
    return res.status(200).json(req.body)
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: err.message })
  }
}
