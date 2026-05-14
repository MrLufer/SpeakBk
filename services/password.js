'use strict'

const crypto = require('crypto')
const { promisify } = require('util')

const scrypt = promisify(crypto.scrypt)
const KEY_LENGTH = 64
const HASH_PREFIX = 'scrypt'

function safeEqual (left, right) {
  const leftBuffer = Buffer.from(String(left))
  const rightBuffer = Buffer.from(String(right))

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function isPasswordHash (password) {
  return typeof password === 'string' && password.startsWith(`${HASH_PREFIX}:`)
}

function needsPasswordMigration (password) {
  return Boolean(password) && !isPasswordHash(password)
}

async function hashPassword (password) {
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('La contraseña es requerida')
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, KEY_LENGTH)

  return `${HASH_PREFIX}:${salt}:${derivedKey.toString('hex')}`
}

async function verifyPassword (password, storedPassword) {
  if (!password || !storedPassword) {
    return false
  }

  if (!isPasswordHash(storedPassword)) {
    return safeEqual(password, storedPassword)
  }

  const [, salt, storedKey] = storedPassword.split(':')

  if (!salt || !storedKey) {
    return false
  }

  const storedBuffer = Buffer.from(storedKey, 'hex')
  const derivedKey = await scrypt(password, salt, storedBuffer.length)

  return crypto.timingSafeEqual(storedBuffer, derivedKey)
}

module.exports = {
  hashPassword,
  needsPasswordMigration,
  verifyPassword
}
