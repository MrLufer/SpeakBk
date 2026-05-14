'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

//MODELO DE LA EMPRESA
const UserSchema = new Schema({
  ruc: { type: Number, unique: true },
  razon: {type: String}
})



module.exports = mongoose.model('User', UserSchema)
