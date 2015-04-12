var nodemailer = require('nodemailer'),
    nodemailerHandlebars = require('nodemailer-express-handlebars');

var mailerOptions = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/email/',
         defaultLayout : 'template',
         partialsDir : 'views/partials/'
     },
     viewPath: 'views/email/',
     extName: '.hbs'
 };

//EMAILING: create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'beautyhuntapp@gmail.com',
        pass: 'beautyhunt123'
    }
});

transporter.use('compile', nodemailerHandlebars(mailerOptions));

module.exports = transporter;