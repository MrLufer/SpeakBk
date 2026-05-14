'use strict'

const Rep = require('../models/useremp')
const { handleControllerError, validateFields } = require('./utils')

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
  if (!validateFields(req, res, ['email', 'name', 'dni'])) {
    return
  }

  try {
    const usuario = new Rep({
      email: req.body.email,
      name: req.body.name,
      dni: req.body.dni,
      empresa: req.body.empresa,
      facultades: req.body.facultades
    })

    const usuarioStored = await usuario.save()

    return res.status(200).send({ usuario: usuarioStored })
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
