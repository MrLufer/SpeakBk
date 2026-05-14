module.exports = {
  port: process.env.PORT || 8000,
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 8000}`,
  db: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/speakbk',
  SECRET_TOKEN: process.env.SECRET_TOKEN || 'dev-secret-change-me',
  mail: {
    service: process.env.MAIL_SERVICE || 'gmail',
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}
