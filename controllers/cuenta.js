'use strict'

const Cuenta = require('../models/cuenta')

function saveCuenta (req, res) {
  console.log('POST /api/cuenta')
  console.log(req.body)

  let cuenta = new Cuenta()
  cuenta.empresa = req.body.empresa
  cuenta.proeevedor = req.body.proeevedor
  cuenta.ruc = req.body.ruc
  cuenta.monto = req.body.monto
  cuenta.factura = req.body.factura
  cuenta.fechaemision = req.body.fechaemision
  cuenta.fechavencimiento = req.body.fechavencimiento
  cuenta.personacontacto = req.body.personacontacto
  cuenta.descripcion = req.body.descripcion
  cuenta.telefono = req.body.telefono
  cuenta.estado = req.body.estado
  cuenta.tipo = req.body.tipo

  cuenta.save((err, cuentaStored) => {
    if (err) res.status(500).send({message: `Error al salvar en la base de datos: ${err} `})

    res.status(200).send({ cuenta: cuentaStored })
  })
}

function getCuenta (req, res) {
  Cuenta.find({}, (err, cuenta) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!cuenta) return res.status(404).send({message: 'No existe las cuentas'})

    res.send(200, { cuenta })
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
