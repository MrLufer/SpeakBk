'use strict'

const express = require('express')
const userCtrl = require('../controllers/user');
const api = express.Router()

//user routes

api.post('/buscar', cuentaCtrl.Buscar)
api.post('/search', cuentaCtrl.Search)
api.post('/getfactura', cuentaCtrl.getFactura)
api.post ('/getdniuser', masterCtrl.getUserDni)
api.post('/getempuser',masterCtrl.admuser)
api.post ('/adduser', masterCtrl.saveUser)
api.post ('/getuser',masterCtrl.getUsuariosEmpresa)
api.post('/cuentaDeuda',cuentaCtrl.getCuentaEmpresaDeuda)
api.post('/cuentaCobrar',cuentaCtrl.getCuentaEmpresa)
api.get('/obcuenta', cuentaCtrl.getCuenta)
api.post('/cuenta', cuentaCtrl.saveCuenta)
api.post('/getempresasruc', userCtrl.getEmpresas)

api.post('/regempresa' , userCtrl.registrarEmpresa)
api.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})



module.exports = api
