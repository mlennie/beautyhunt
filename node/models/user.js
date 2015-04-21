// load mongoose since we need it to define a model
var mongoose = require('mongoose'),
		transporter = require('../config/email'),
	  bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

//define schema
var userSchema = new Schema({
  username: String,
  email: String,
  passwordHash: String,
  confirmation_token: String,
  confirmed_at: Date, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

//methods
userSchema.statics.hashPassword = function(password, cb ) {
	bcrypt.genSalt(10, function(err, salt) {
    
    if (err) return cb(err);

    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return cb(err);
    	return cb(null, hash);
    });
  });
};

userSchema.methods.checkPassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
};

userSchema.methods.sendConfirmationEmail = function(username, token) {
	// setup e-mail data with unicode symbols 
  var confirmMailOptions = {
    from: 'Beauty Hunt <no-reply@beautyhunt.com>', 
    to: 'montylennie@gmail.com', 
    subject: 'Please confirm your account', 
    text: 'please confirm your account',  
    template: 'user_confirm',
    context: {
      username: username,
      confirmLink: "http://192.168.10.10:8080/api/users/confirm/" + token
    }
  };

  // send mail with defined transport object 
  transporter.sendMail(confirmMailOptions, function(error, info){
    if(error){
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
    transporter.close();
  });
};

userSchema.methods.sendPasswordEmail = function(username, token) {
  // setup e-mail data with unicode symbols 
  var confirmMailOptions = {
    from: 'Beauty Hunt <no-reply@beautyhunt.com>', 
    to: 'montylennie@gmail.com', 
    subject: 'Password Reset Requested', 
    text: 'you can reset your password here: ' + 
          "http://192.168.10.10:4200/users/edit_password/?token=" + token,
    template: 'edit_password',
    context: {
      username: username,
      passwordResetLink: "http://192.168.10.10:4200/users/edit-password/?token=" + token
    }
  };

  // send mail with defined transport object 
  transporter.sendMail(confirmMailOptions, function(error, info){
    if(error){
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
    transporter.close();
  });
};

//define model
module.exports = mongoose.model('User', userSchema);

