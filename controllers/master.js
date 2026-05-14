'use strict'

const Rep = require('../models/useremp')
const { hashPassword } = require('../services/password')
const { handleControllerError, validateFields } = require('./utils')

function sanitizeRep (user) {
  const data = typeof user.toObject === 'function' ? user.toObject() : { ...user }

  delete data.password
  delete data.__v

  return data
}

async function getUsuariosEmpresa (req, res) {
  if (!validateFields(req, res, ['empresa'])) {
    return
  }

  try {
    const emp = req.body.empresa

    const usuario = await Rep.find({ empresa: emp })

    return res.status(200).send({ usuario })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function getUserDni (req, res) {
  if (!validateFields(req, res, ['dni'])) {
    return
  }

  try {
    const dni = req.body.dni

    const usuario = await Rep.find({ dni })

    return res.status(200).send({ usuario })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function saveUser (req, res) {
  if (!validateFields(req, res, ['email', 'name', 'dni', 'empresa', 'password'])) {
    return
  }

  try {
    const usuario = new Rep({
      email: String(req.body.email).toLowerCase().trim(),
      name: req.body.name,
      dni: req.body.dni,
      empresa: req.body.empresa,
      password: await hashPassword(req.body.password),
      facultades: req.body.facultades
    })

    const usuarioStored = await usuario.save()

    return res.status(200).send({ usuario: sanitizeRep(usuarioStored) })
  } catch (err) {
    return handleControllerError(res, err, 'Error al salvar en la base de datos')
  }
}

async function admuser (req, res) {
  if (!validateFields(req, res, ['dni', 'empresa'])) {
    return
  }

  try {
    const dni = req.body.dni
    const emp = req.body.empresa

    const usuario = await Rep.find({ dni, empresa: emp })

    return res.status(200).send({ usuario })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

module.exports = {
  admuser,
  saveUser,
  getUsuariosEmpresa,
  getUserDni
}
