'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
//const server = require('http').Server(app)
//const io = require('socket.io')(server)



mongoose.connect(config.db, (err, res) => {
  if (err)  {
    return console.log(`Error al conectar a la base de datos: ${err}`)
  }
  console.log('Conexión a la base de datos establecida')

  io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


  server.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`)
  })


})
