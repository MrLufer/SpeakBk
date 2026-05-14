'use strict'

const jwt = require('jsonwebtoken')
const config = require ('../config')

function createToken (user) {
  return jwt.sign(
    { sub: user._id },
    config.SECRET_TOKEN,
    { expiresIn: '14d' }
  )
}

function decodeToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.SECRET_TOKEN, (err, payload) => {
      if (err) {
        return reject({
          status: 401,
          message: err.name === 'TokenExpiredError' ? 'El token ha expirado' : 'Token inválido'
        })
      }

      resolve(payload.sub)
    })
  })
}

module.exports = {
  createToken,
  decodeToken
}
