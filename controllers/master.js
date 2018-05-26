const Rep = require('../models/useremp')


function getUsuariosEmpresa (req,res){
  let emp = req.body.empresa
  console.log(emp)
  Rep.find({empresa: emp}, (err, usuario) => {
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!usuario) return res.status(404).send({message: 'No existe el usuario'})

    res.send(200, { usuario })
  })

}

function getUserDni (req,res){
  let dni = req.body.dni
  console.log(dni)
  Rep.find({dni: dni},(err,usuario)=>{
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!usuario) return res.status(404).send({message: 'No existen usuarios registrados'})

    res.send(200, { usuario })

  })
}




function saveUser (req,res){
  let usuario = new Rep ()

  usuario.email = req.body.email
  usuario.name = req.body.name
  usuario.dni = req.body.dni
  usuario.empresa = req.body.empresa
  usuario.facultades = req.body.facultades

  usuario.save((err, usuarioStored) => {
    if (err) res.status(500).send({message: `Error al salvar en la base de datos: ${err} `})

    res.status(200).send({ usuario: usuarioStored })
  })


}


function admuser (req,res){
  let dni = req.body.dni
  let emp = req.body.empresa
  console.log(dni)
  Rep.find({dni: dni , empresa: emp},(err,usuario)=>{
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!usuario) return res.status(404).send({message: 'No existen usuarios registrados'})

    res.send(200, { usuario })

  })
}


module.exports = {
  admuser,
  saveUser,
  getUsuariosEmpresa,
  getUserDni

}
