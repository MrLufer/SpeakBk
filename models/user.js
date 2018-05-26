'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')


//MODELO DE LA EMPRESA
const UserSchema = new Schema({
  ruc: { type: Number, unique: true },
  razon: {type: String}
})



module.exports = mongoose.model('User', UserSchema)
