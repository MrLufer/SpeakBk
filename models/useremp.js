'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


// USUARIOS Y REPRESENTANTES
const RepSchema =  Schema({

  email: { type: String, required: true,unique: true},
  name: {type: String, required: true},
  dni: { type: Number, required: true,unique: true},
  password: { type: String },
  suspendido: { type: Boolean, default: false},
  facultades: { type: Boolean, default: true},
  empresa:{type: String},
  active: {type: Boolean,  default: false}
})



module.exports = mongoose.model('Rep', RepSchema)
