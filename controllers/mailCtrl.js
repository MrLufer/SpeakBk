var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res){
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'Admin@cashin.pe',
            pass: 'EGRURY51LALALA45'
        }
    });
// Definimos el email

const url = 'http://localhost:3000/generatepassword/${emailToken}';

var mailOptions = {
    from: 'Admin@cashin.pe',
    to: req.body.correo,
    subject: 'Bienvenido a Cashin!',
    html: 'Bienvenido a Cashin, verifique su correo haciendo click <a href="${url}">aquí</a> para activar tu cuenta'
};
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        res.send(500, err.message);
    } else {
        console.log("Email enviado");
        res.status(200).jsonp(req.body);
    }
});
};
