'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


// USUARIOS Y REPRESENTANTES
const RepSchema = Schema({

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  dni: { type: Number, required: true, unique: true },
  password: { type: String, required: true, select: false },
  suspendido: { type: Boolean, default: false },
  facultades: { type: Boolean, default: true },
  empresa: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true }
}, { timestamps: true })



module.exports = mongoose.model('Rep', RepSchema)
