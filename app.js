'use strict'

const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const api = require('./routes')
const path = require('path')

app.disable('x-powered-by')
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.engine('.hbs', engine({
  defaultLayout: 'default',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')

app.use('/api', api)

const pages = [
  { route: '/', view: 'index', locals: { css: 'index', js: 'login' } },
  { route: '/index', view: 'index', locals: { css: 'index', js: 'login' } },
  { route: '/welcome', view: 'welcome', locals: { css: 'welcome_styles' } },
  { route: '/olvide', view: 'olvide', locals: { css: 'olvide' } },
  { route: '/registro', view: 'registro', locals: { css: 'registro' } },
  { route: '/chat', view: 'chat', locals: { css: 'chat' } },
  { route: '/tarjetas', view: 'tarjetas', locals: { css: 'tarjetas' } },
  { route: '/calendario', view: 'calendario', locals: { css: 'calendario_styles' } },
  { route: '/cpagar', view: 'cpagar', locals: { css: 'cpagar_styles', js: 'pagar' } },
  { route: '/ccobrar', view: 'ccobrar', locals: { css: 'cpagar_styles', js: 'pagar' } },
  { route: '/consultaEmpresa', view: 'consultaE', locals: { css: 'consultaE_styles' } },
  { route: '/consultaPersona', view: 'consultaP' },
  { route: '/admuser', view: 'admuser', locals: { css: 'admuser_styles' } },
  { route: '/ctscobrar', view: 'ctscobrar', locals: { css: 'ctscobrar' } },
  { route: '/busqueda', view: 'busqueda', locals: { css: 'ctscobrar' } },
  { route: '/ctspagar', view: 'ctspagar', locals: { css: 'ctspagar' } },
  { route: '/master', view: 'master', locals: { js: 'master' } },
  { route: '/password', view: 'password', locals: { css: 'password' } },
  { route: '/generatepassword', view: 'generatePass', locals: { css: 'password' } },
  { route: '/flujos', view: 'chart', locals: { js: 'main', jsx: 'Chart.bundle.min' } },
  { route: '/changedpass', view: 'changepass', locals: { css: 'change' } }
]

pages.forEach(({ route, view, locals = {} }) => {
  app.get(route, (req, res) => {
    res.render(view, locals)
  })
})

app.use((req, res) => {
  res.status(404).send({ message: 'Ruta no encontrada' })
})

module.exports = app
