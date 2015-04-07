var express = require('express');
var router = express.Router();

// load the user model
var User = require('../models/user'),
    nodemailer = require('nodemailer'),
    nodemailerHandlebars = require('nodemailer-express-handlebars'),
    bcrypt = require('bcryptjs');

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


// api ---------------------------------------------------------------------
// get all users
router.get('/', function(req, res) {

  User.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
    res.json(users);
  });
});

// create user and send back all users after creation
	router.post('/', function(req, res) {

  //encrypt password
  var password = req.body.user.password;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return console.error(err);
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return console.error(err);

      //create user
      var user = new User({ 
        username: req.body.user.username,
        email: req.body.user.email,
        passwordHash: hash 
      })

      user.save(function (err, user) {
        if (err) return console.error(err);

        // send email
        // setup e-mail data with unicode symbols 
        var confirmMailOptions = {
          from: 'Beauty Hunt <no-reply@beautyhunt.com>', 
          to: 'montylennie@gmail.com', 
          subject: 'Please confirm your account', 
          text: 'please confirm your account',  
          template: 'user_confirm',
          context: {
            username: user.username,
            confirmLink: "<<link to confirm account>>"
          }
        };

        // send mail with defined transport object 
        transporter.sendMail(confirmMailOptions, function(error, info){
          if(error){
            console.log(error);
            transporter.close();
            res.status('404');
          }else{
            console.log('Message sent: ' + info.response);
            transporter.close();
            //send response to user
            console.log('user created: ' + user);
            res.status('201').json(user);
          }
        });
      });
    });
  });
});

// delete a user
router.delete('/api/users/:user_id', function(req, res) {
});

module.exports = router;