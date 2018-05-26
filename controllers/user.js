'use strict'

const User = require('../models/user')
const service = require('../services')


 /* function signUp (req, res) {
  const user = new User({
    dni: req.body.dni,
    displayName: req.body.displayName,
    password: req.body.password
  })

  user.save((err) => {
    if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

    return res.status(201).send({ token: service.createToken(user) })
  })
}
*/
function signIn (req, res) {
  User.find({ dni: req.body.dni }, (err, user) => {
    if (err) return res.status(500).send({ message: err })
    if (!user) return res.status(404).send({ message: 'No existe el usuario' })

    req.user = user
    res.status(200).send({
      message: 'Te has logueado correctamente',
      token: service.createToken(user)
    })
  })
}

function getEmpresas (req,res){
  let ruc = req.body.ruc
  User.find({ruc: ruc}, (err,empresas)=>{
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!empresas) return res.status(404).send({message: 'No existen usuarios registrados'})

    res.send(200, { empresas })
  })
}

function registrarEmpresa (req,res){
  const empresa = new User()
    empresa.ruc= req.body.ruc,
    empresa.razon= req.body.razon


  empresa.save((err) => {
    if (err) return res.status(500).send({ message: `Error al crear empresa: ${err}` })
    return res.status(201).send({ empresa })
  })



}


module.exports = {
  registrarEmpresa,
  getEmpresas,

}
