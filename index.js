'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
const server = require('http').Server(app)
const { Server } = require('socket.io')
const io = new Server(server)

async function start () {
  try {
    await mongoose.connect(config.db)
    console.log('Conexión a la base de datos establecida')

    io.on('connection', (socket) => {
      socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
      })
    })

    server.listen(config.port, () => {
      console.log(`API REST corriendo en http://localhost:${config.port}`)
    })
  } catch (err) {
    console.error(`Error al conectar a la base de datos: ${err.message}`)
    process.exitCode = 1
  }
}

start()
