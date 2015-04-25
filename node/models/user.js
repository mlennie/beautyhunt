// load mongoose since we need it to define a model
var mongoose = require('mongoose'),
		transporter = require('../config/email'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    Identity = require('./identity'),
	  bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var jwtSecret = 'xxx';

//define schema
var userSchema = new Schema({
  username: String,
  email: String,
  facebook_id: String,
  facebook_link: String,
  name: String,
  timezone: String,
  locale: String,
  first_name: String,
  last_name: String,
  gender: String,
  passwordHash: String,
  confirmation_token: String,
  confirmed_at: Date, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

//methods

//create token for sessions
userSchema.methods.createToken = function(time, cb) {
  //eg time = [7, 'days']
  var expires = moment().add(time[0], time[1]).valueOf();
  var token = jwt.encode({
    iss: this.id,
    exp: expires
  }, jwtSecret);
  return cb(null, token);
};

userSchema.statics.hashPassword = function(password, cb ) {
	bcrypt.genSalt(10, function(err, salt) {
    
    if (err) return cb(err);

    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return cb(err);
    	return cb(null, hash);
    });
  });
};

//register user with facebook data
userSchema.statics.registerWithFacebook = function(data, cb) {
  
  var user = new this({
    email: data.email,
    gender: data.gender,
    name: data.name,
    first_name: data.first_name,
    last_name: data.last_name,
    facebook_id: data.id,
    timezone: data.timezone,
    facebook_link: data.link,
    locale: data.locale,
    confirmed_at: new Date()
  });

  user.save(function(err, user) {
    if (err) return cb(err);
    return cb(null, user);
  });
};

//register user with facebook data
userSchema.statics.loginWithFacebook = function(data, cb) {
  
};

//find user by username or password
userSchema.statics.findByIdentification = function(identification, cb) {
  var _this = this;

  var identitiesArray = ["email", "username", "facebook_id"];

  checkIdentity(identitiesArray, 0, identification);

  function checkIdentity(identitiesArray, i, identification) {

    //get identity from array
    var identity = identitiesArray[i];

    //search for user 
    _this.findOne({identity: identification}, function(err, user) {
      
      if (err) return cb(err);
      if (user) return cb(null, user);

      //if didn't find user, increase index and try again
      i++
      if (identitiesArray[i]) {
        checkIdentity(identitiesArray, i, identification);
      } else {
        //return null null if didn't find a user
        return cb(null, null);
      }
    });
  }
};

userSchema.statics.connectWithProvider = function(req, cb) {
  var _this = this;
  var User = _this.model('User');
  var provider = req.params.provider;
  var data = req.body;

  if (provider == 'facebook') {
    User.findByIdentification(data.id, function(err, user) {
      if (err) return cb(err);
      if (!user) {
        User.findByIdentification(data.email, function(err, user) {
          if (err) return cb(err);
          if (!user) {
            //no user found. start registration process
            User.registerWithFacebook(data, function(err, user) {
              if (err) return cb(err);
              if (!user) return cb({error: "could not save user"});
              //start login process
              //create token
              var time = [7, 'days'];
              user.createToken(time, function(err, token) {
                Identity.createIdentity(token, user.id, function(err, identity) {
                  if (err) return cb(err);
                  return cb(null, user, token);
                });
              });
            });
          } else {
            //user found start login process
            console.log('user found with email');
            //create token
            var time = [7, 'days'];
            user.createToken(time, function(err, token) {
              Identity.createIdentity(token, user.id, function(err, identity) {
                if (err) return cb(err);
                return cb(null, user, token);
              });
            });
          }
        });
      } else {
        //user found start login process
        console.log('user found with facebook_id');
        //create token
        var time = [7, 'days'];
        user.createToken(time, function(err, token) {
          Identity.createIdentity(token, user.id, function(err, identity) {
            if (err) return cb(err);
            return cb(null, user, token);
          });
        });
      }
    });
  }
};


userSchema.statics.checkUniqueness = function (email, username, cb) {

  var _this = this;

  this.findOne({email: email}, function(err, user) {
    if (err) return cb(err);
    if (user) {
      return cb(null, "Email already in use. " + 
          "Please choose another email." );
    }
    
    _this.findOne({username: username}, function(err, user) {
      if (err) return cb(err);
      if (user) {
        return cb(null, "Username already in use. " + 
            "Please choose another username." );
      }
      return cb(null,null);
    });
  });
};

userSchema.methods.checkPassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
};

userSchema.methods.addConfirmationToken = function(cb) {

  //make token
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: this.id,
    exp: expires
  }, jwtSecret);

  //add and save to user
  this.confirmation_token = token;
  this.save(function (err, user) {
    
    if (err) return cb(err);

    return cb(null, user);
  });
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

