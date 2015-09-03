/*
////////////////////////////////////////////////////
//                 Mailer                         //
////////////////////////////////////////////////////

This is an example call to the mailer object. Notice the ability
to specify a custom "replyTo" field.

mailer.sendMail({
    from: 'Payload Cupcake <cupcake@letter.payload.pk>',
    replyTo: 'support@payload.pk',
    to: 'aminshahgilani@gmail.com',
    subject: 'hello',
    text: 'hello world!'
}, function(err, info) {
   if (err) console.log(err);
   console.log(info);
});
*/

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
    user: 'process.env.MG_USER',
    pass: 'process.env.MG_PASS'
  }
});

module.exports = transporter;
