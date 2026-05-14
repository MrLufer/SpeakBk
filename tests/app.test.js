'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const app = require('../app')
const Cuenta = require('../models/cuenta')
const Rep = require('../models/useremp')
const { hashPassword } = require('../services/password')

const pageRoutes = [
  '/',
  '/index',
  '/welcome',
  '/olvide',
  '/registro',
  '/chat',
  '/tarjetas',
  '/calendario',
  '/cpagar',
  '/ccobrar',
  '/consultaEmpresa',
  '/consultaPersona',
  '/admuser',
  '/ctscobrar',
  '/busqueda',
  '/ctspagar',
  '/master',
  '/password',
  '/generatepassword',
  '/flujos',
  '/changedpass'
]

test('renders all page routes', async () => {
  for (const route of pageRoutes) {
    await request(app)
      .get(route)
      .expect(200)
      .expect('Content-Type', /html/)
  }
})

test('does not expose Express implementation header', async () => {
  const response = await request(app)
    .get('/')
    .expect(200)

  assert.equal(response.headers['x-powered-by'], undefined)
})

test('serves active image assets referenced by rendered pages', async () => {
  const response = await request(app)
    .get('/')
    .expect(200)

  assert.match(response.text, /\/img\/logo\.jpg/)
  assert.match(response.text, /\/img\/candado\.png/)

  await request(app)
    .get('/img/logo.jpg')
    .expect(200)
    .expect('Content-Type', /image/)

  await request(app)
    .get('/img/banner1.jpg')
    .expect(200)
    .expect('Content-Type', /image/)
})

test('returns controlled 404 responses', async () => {
  const response = await request(app)
    .get('/does-not-exist')
    .expect(404)
    .expect('Content-Type', /json/)

  assert.deepEqual(response.body, { message: 'Ruta no encontrada' })
})

test('rejects protected API requests without authorization', async () => {
  const response = await request(app)
    .get('/api/private')
    .expect(403)

  assert.deepEqual(response.body, { message: 'No tienes autorización' })
})

test('validates required fields before touching persistence', async () => {
  const response = await request(app)
    .post('/api/regempresa')
    .send({ ruc: 12345678901 })
    .expect(400)

  assert.equal(response.body.message, 'Campos requeridos: razon')
  assert.deepEqual(response.body.fields, ['razon'])
})

test('validates filtered account APIs before touching persistence', async () => {
  const cases = [
    { route: '/api/buscar', body: { empresa: 'ACME' }, missing: ['tipo'] },
    { route: '/api/search', body: { ruc: 12345678901 }, missing: ['tipo'] },
    { route: '/api/getfactura', body: { empresa: 'ACME' }, missing: ['factura'] },
    { route: '/api/cuentaDeuda', body: { empresa: 'ACME' }, missing: ['tipo'] },
    { route: '/api/cuentaCobrar', body: { empresa: 'ACME' }, missing: ['tipo'] },
    { route: '/api/cuenta', body: { empresa: 'ACME', tipo: 'Pagar' }, missing: ['factura'] }
  ]

  for (const item of cases) {
    const response = await request(app)
      .post(item.route)
      .send(item.body)
      .expect(400)

    assert.equal(response.body.message, `Campos requeridos: ${item.missing.join(', ')}`)
    assert.deepEqual(response.body.fields, item.missing)
  }
})

test('searches accounts by provider name from the UI search flow', async (t) => {
  const originalFind = Cuenta.find
  let query

  t.after(() => {
    Cuenta.find = originalFind
  })

  Cuenta.find = async (criteria) => {
    query = criteria
    return []
  }

  await request(app)
    .post('/api/buscar')
    .send({ proeevedor: 'Proveedor SAC', tipo: 'Pagar' })
    .expect(200)

  assert.deepEqual(query, { tipo: 'Pagar', proeevedor: 'Proveedor SAC' })
})

test('validates sign in credentials before touching persistence', async () => {
  const response = await request(app)
    .post('/api/signin')
    .send({ password: 'Clave123' })
    .expect(400)

  assert.equal(response.body.message, 'Campos requeridos: identifier')
  assert.deepEqual(response.body.fields, ['identifier'])
})

test('signs in representatives without exposing password hashes', async (t) => {
  const originalFindOne = Rep.findOne
  const password = await hashPassword('Clave123')
  let query

  t.after(() => {
    Rep.findOne = originalFindOne
  })

  Rep.findOne = (criteria) => {
    query = criteria

    return Promise.resolve({
      _id: '507f1f77bcf86cd799439011',
      email: 'demo@example.com',
      name: 'Demo User',
      dni: 12345678,
      password,
      suspendido: false,
      facultades: true,
      empresa: 'EMPRESA 2',
      active: true,
      toObject () {
        return {
          _id: this._id,
          email: this.email,
          name: this.name,
          dni: this.dni,
          password: this.password,
          suspendido: this.suspendido,
          facultades: this.facultades,
          empresa: this.empresa,
          active: this.active
        }
      }
    })
  }

  const response = await request(app)
    .post('/api/signin')
    .send({ identifier: 'demo@example.com', password: 'Clave123' })
    .expect(200)

  assert.deepEqual(query, { email: 'demo@example.com' })
  assert.equal(response.body.message, 'Te has logueado correctamente')
  assert.equal(response.body.user.email, 'demo@example.com')
  assert.equal(response.body.user.password, undefined)
  assert.equal(typeof response.body.token, 'string')
})

test('creates representatives with hashed passwords and sanitized responses', async (t) => {
  const originalSave = Rep.prototype.save

  t.after(() => {
    Rep.prototype.save = originalSave
  })

  Rep.prototype.save = async function () {
    return this
  }

  const response = await request(app)
    .post('/api/adduser')
    .send({
      email: 'NUEVO@EXAMPLE.COM',
      name: 'Nuevo User',
      dni: 87654321,
      empresa: 'EMPRESA 2',
      password: 'Clave123',
      facultades: true
    })
    .expect(200)

  assert.equal(response.body.usuario.email, 'nuevo@example.com')
  assert.equal(response.body.usuario.password, undefined)
})

test('chat page uses Socket.IO client and no dead API call', async () => {
  const response = await request(app)
    .get('/chat')
    .expect(200)

  assert.match(response.text, /\/socket\.io\/socket\.io\.js/)
  assert.doesNotMatch(response.text, /\/api\/chat/)
})
