module.exports = {
  port: process.env.PORT || 8000,
  db: process.env.MONGODB_URI || 'mongodb://speakbk:speakbk@ds235850.mlab.com:35850/speakbk',
  SECRET_TOKEN: 'miclavedetokens'
}
