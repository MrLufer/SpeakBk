'use strict'

function missingFields (body, fields) {
  return fields.filter((field) => {
    const value = body[field]
    return value === undefined || value === null || value === ''
  })
}

function validateFields (req, res, fields) {
  const missing = missingFields(req.body, fields)

  if (missing.length === 0) {
    return true
  }

  res.status(400).send({
    message: `Campos requeridos: ${missing.join(', ')}`,
    fields: missing
  })

  return false
}

function handleControllerError (res, err, message) {
  if (err && err.code === 11000) {
    return res.status(409).send({ message: 'El registro ya existe' })
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).send({ message: err.message })
  }

  return res.status(500).send({ message })
}

module.exports = {
  handleControllerError,
  validateFields
}
