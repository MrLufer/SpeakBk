'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CuentaSchema = Schema({

  empresa: {type: String},
  proeevedor: {type: String},
  ruc: {type: Number },
  factura: {type: String, unique: true },
  monto: {type: Number},
  fechaemision: {type: String},
  fechavencimiento: {type: String},
  descripcion: {type: String},
  personacontacto: {type: String},
  telefono: {type: Number},
  estado: {type: String},
  tipo:{type: String}


})

module.exports = mongoose.model('Cuenta', CuentaSchema)
