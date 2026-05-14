'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const app = require('../app')

const pageRoutes = [
  '/',
  '/index',
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

test('chat page uses Socket.IO client and no dead API call', async () => {
  const response = await request(app)
    .get('/chat')
    .expect(200)

  assert.match(response.text, /\/socket\.io\/socket\.io\.js/)
  assert.doesNotMatch(response.text, /\/api\/chat/)
})
