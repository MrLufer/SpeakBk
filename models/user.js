const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({

  user: String,
  region: String,
  edad: Number,
  password: String


mongoose.model('user', userSchema)
