'use strict'

const Cuenta = require('../models/cuenta')
const { handleControllerError, validateFields } = require('./utils')

async function saveCuenta (req, res) {
  if (!validateFields(req, res, ['empresa', 'factura', 'tipo'])) {
    return
  }

  try {
    const cuenta = new Cuenta({
      empresa: req.body.empresa,
      proeevedor: req.body.proeevedor,
      ruc: req.body.ruc,
      monto: req.body.monto,
      factura: req.body.factura,
      fechaemision: req.body.fechaemision,
      fechavencimiento: req.body.fechavencimiento,
      personacontacto: req.body.personacontacto,
      descripcion: req.body.descripcion,
      telefono: req.body.telefono,
      estado: req.body.estado,
      tipo: req.body.tipo
    })

    const cuentaStored = await cuenta.save()

    return res.status(200).send({ cuenta: cuentaStored })
  } catch (err) {
    return handleControllerError(res, err, 'Error al salvar en la base de datos')
  }
}

async function getCuenta (req, res) {
  try {
    const cuenta = await Cuenta.find({})

    return res.status(200).send({ cuenta })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function getCuentaEmpresa (req, res) {
  if (!validateFields(req, res, ['empresa', 'tipo'])) {
    return
  }

  try {
    const emp = req.body.empresa
    const tipo = req.body.tipo

    const cuenta = await Cuenta.find({ empresa: emp, tipo })

    return res.status(200).send({ cuenta })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function getCuentaEmpresaDeuda (req, res) {
  if (!validateFields(req, res, ['empresa', 'tipo'])) {
    return
  }

  try {
    const emp = req.body.empresa
    const tipo = req.body.tipo

    const cuenta = await Cuenta.find({ empresa: emp, tipo })

    return res.status(200).send({ cuenta })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function getFactura (req, res) {
  if (!validateFields(req, res, ['empresa', 'factura'])) {
    return
  }

  try {
    const emp = req.body.empresa
    const fac = req.body.factura
    const cuenta = await Cuenta.find({ empresa: emp, factura: fac })

    return res.status(200).send({ cuenta })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function Buscar (req, res) {
  if (!validateFields(req, res, ['empresa', 'tipo'])) {
    return
  }

  try {
    const emp = req.body.empresa
    const tipo = req.body.tipo
    const cuenta = await Cuenta.find({ empresa: emp, tipo })

    return res.status(200).send({ cuenta })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

async function Search (req, res) {
  if (!validateFields(req, res, ['ruc', 'tipo'])) {
    return
  }

  try {
    const ruc = req.body.ruc
    const tipo = req.body.tipo
    const cuenta = await Cuenta.find({ ruc, tipo })

    return res.status(200).send({ cuenta })
  } catch (err) {
    return handleControllerError(res, err, 'Error al realizar la petición')
  }
}

module.exports = {
  Search,
  Buscar,
  saveCuenta,
  getCuenta,
  getFactura,
  getCuentaEmpresa,
  getCuentaEmpresaDeuda
}
