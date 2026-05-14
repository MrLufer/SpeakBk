'use strict'

const User = require('../models/user')
const service = require('../services')
const { handleControllerError, validateFields } = require('./utils')

async function signIn (req, res) {
  if (!validateFields(req, res, ['dni'])) {
    return
  }

  try {
    const user = await User.findOne({ dni: req.body.dni })

    if (!user) {
      return res.status(404).send({ message: 'No existe el usuario' })
    }

    req.user = user
    return res.status(200).send({
      message: 'Te has logueado correctamente',
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
