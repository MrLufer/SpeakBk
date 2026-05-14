'use strict'

const User = require('../models/user')
const Rep = require('../models/useremp')
const service = require('../services')
const { hashPassword, needsPasswordMigration, verifyPassword } = require('../services/password')
const { handleControllerError, validateFields } = require('./utils')

function getCredentialsQuery (identifier) {
  const credential = String(identifier).trim()

  if (credential.includes('@')) {
    return { email: credential.toLowerCase() }
  }

  const dni = Number(credential)

  if (Number.isInteger(dni)) {
    return { dni }
  }

  return { email: credential.toLowerCase() }
}

function sanitizeRep (user) {
  const data = typeof user.toObject === 'function' ? user.toObject() : { ...user }

  delete data.password
  delete data.__v

  return data
}

async function findRepWithPassword (query) {
  const userQuery = Rep.findOne(query)

  if (userQuery && typeof userQuery.select === 'function') {
    return userQuery.select('+password')
  }

  return userQuery
}

async function signIn (req, res) {
  if (!validateFields(req, res, ['password'])) {
    return
  }

  const identifier = req.body.identifier || req.body.email || req.body.dni || req.body.name

  if (!identifier) {
    return res.status(400).send({
      message: 'Campos requeridos: identifier',
      fields: ['identifier']
    })
  }

  try {
    const query = getCredentialsQuery(identifier)
    const user = await findRepWithPassword(query)

    if (!user || !await verifyPassword(req.body.password, user.password)) {
      return res.status(401).send({ message: 'Credenciales inválidas' })
    }

    if (user.suspendido) {
      return res.status(403).send({ message: 'La cuenta está suspendida' })
    }

    if (user.active === false) {
      return res.status(403).send({ message: 'La cuenta está pendiente de activación' })
    }

    if (needsPasswordMigration(user.password) && typeof user.save === 'function') {
      user.password = await hashPassword(req.body.password)
      await user.save()
    }

    return res.status(200).send({
      message: 'Te has logueado correctamente',
      user: sanitizeRep(user),
      token: service.createToken(user)
    })
  } catch (err) {
    return handleControllerError(res, err, 'Error al iniciar sesión')
  }
}

async function getEmpresas (req, res) {
  if (!validateFields(req, res, ['ruc'])) {
    return
  }

  try {
    const ruc = req.body.ruc
    const empresas = await User.find({ ruc })

    return res.status(200).send({ empresas })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function registrarEmpresa (req, res) {
  if (!validateFields(req, res, ['ruc', 'razon'])) {
    return
  }

  try {
    const empresa = new User({
      ruc: req.body.ruc,
      razon: req.body.razon
    })

    const empresaStored = await empresa.save()

    return res.status(201).send({ empresa: empresaStored })
  } catch (err) {
    return handleControllerError(res, err, 'Error al crear empresa')
  }
}

module.exports = {
  registrarEmpresa,
  getEmpresas,
  signIn
}
