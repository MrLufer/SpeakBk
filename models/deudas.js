'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeudaSchema = Schema({

  empresa: {type: String},
  proeevedor: {type: String},
  ruc: {type: Number },
  factura: {type: String, unique: true },
  monto: {type: Number},
  fechaemision: {type: String},
  fechavencimiento: {type: String},
  pendiente: {type: Boolean, default:false}
  
})

module.exports = mongoose.model('Deuda', DeudaSchema)
