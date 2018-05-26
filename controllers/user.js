'use strict'

const Cuenta = require('../models/cuenta')

function saveUser (req, res) {
  console.log('POST /api/user')
  console.log(req.body)

  let user = new User()
  user.user = req.body.user
  user.region = req.body.region
  user.edad = req.body.number
  user.password = req.body.password


  user.save((err, userStored) => {
    if (err) res.status(500).send({message: `Error al guardar en la base de datos: ${err} `})

    res.status(200).send({ user: userStored })
  })
}

function getUser (req, res) {

  let usuario = req.body.usuario
  let contraseña = req.body.contraseña
  Cuenta.findOne({ user:usuario , password:contraseña }, (err, user) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe la cuenta'})

    res.send(200, { user })
  })
}

function getCuentaEmpresa (req,res){
  let emp = req.body.empresa
  let cuenta = req.body.tipo
  console.log(emp)
  //{empresa: emp,monto: {$gt: 0}
  Cuenta.find({empresa: emp,tipo: cuenta}, (err, cuenta) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe las cuentas'})

    res.send(200, { cuenta })
  })
}


function getCuentaEmpresaDeuda (req,res){
  let emp = req.body.empresa
  let cuenta = req.body.tipo
  console.log(emp)
  //{empresa: emp,monto: {$lt: 0}
  Cuenta.find({empresa: emp,tipo: cuenta}, (err, cuenta) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe las cuentas'})

    res.send(200, { cuenta })
  })

}


function getFactura (req,res){
  let emp = req.body.empresa
  let fac = req.body.factura
  Cuenta.find({empresa: emp,factura: fac}, (err, cuenta) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe las cuentas'})

    res.send(200, { cuenta })
  })

}





function Buscar (req,res){
  let emp = req.body.empresa
  let tipo = req.body.tipo
  Cuenta.find({empresa: emp,tipo: tipo}, (err, cuenta) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe las cuentas'})

    res.send(200, { cuenta })
  })

}

function Search (req,res){
  let ruc = req.body.ruc
  let tipo = req.body.tipo
  Cuenta.find({ruc:ruc,tipo: tipo}, (err, cuenta) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe las cuentas'})

    res.send(200, { cuenta })
  })

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
