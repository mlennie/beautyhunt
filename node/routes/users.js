var express = require('express');
var router = express.Router();

// load the user model
var User = require('../models/user'),
    Identity = require('../models/identity'),
    jwt = require('jwt-simple'),
    moment = require('moment');

var jwtSecret = 'xxx';

// api ---------------------------------------------------------------------

//delete all users
router.get('/delete_all', function(req, res) {
  User.remove({}, function(err) { 
     console.log('users removed');
     res.sendStatus(200);
  });
});

//resend confirmation email
router.get('/resend_confirmation', function(req, res) {
  //get email
  var email = req.query.email;

  if (!email) {
    res.status('404');
    res.end("did not receive an email");
    return
  } 

  User.findOne({email: email},function (err, user) {
    if (err) return res.status(404).send(err);

    if (!user) {
      return res.status('404').end("no user was found with that email");
    }

    if (user.confirmed_at != undefined) {
      return res.status('404').end("user has already been confirmed");
    }

    //create confirmation token
    user.addConfirmationToken(function(err, user) {
      
      if (err) return res.status(404).send(err);
      
      res.end();
      //send confirmation email
      user.sendConfirmationEmail(user.username, user.confirmation_token);
    });
  });
});

//send password update email
router.get('/password_email', function(req, res) {
  var email = req.query.email;
  
  if (!email) {
    return res.status(401).end();
  }

  User.findOne({email: email}, function(err, user) {

    if (err) return res.status(404).send(err);

    if (!user) {
      return res.status(401).send({ error: 'no user could be found with this email.' });
    }

    //create confirmation token
    var expires = moment().add(7, 'days').valueOf();
    var token = jwt.encode({
      iss: user.id,
      exp: expires
    }, jwtSecret);

    //give user a password reset token
    user.password_reset_token = token;

    user.save(function (err, user) {

      if (err) return res.status(404).send(err);

      res.end();
      //send confirmation email
      user.sendPasswordEmail(user.username, token);
    });  
  });
});

//confirm user account from email
router.get('/confirm/:token', function(req, res) {

  var token = req.params["token"];

  //decode jwt
  var decoded = jwt.decode(token, jwtSecret);

  //check expiration
  if (decoded.exp <= Date.now()) {
    return res.status(401).send({ error: 'token expired' });
  }

  //get user id from decoded token
  var user_id = decoded.iss;

  //find user and confirm if havn't been confirmed yet
  User.findOne({ _id: user_id }, function(err, user) {
    
    if (err) return console.error(err);

    //send back error if can't find user
    if (!user) {
      res.redirect('http://192.168.10.10:4200/users/login?confirmation_fail=true');    
    }

    //send back user if already confirmed
    if (user.confirmed_at != null) {
      res.redirect('http://192.168.10.10:4200/users/login?confirmation_fail=true');
    }

    user.confirmed_at = new Date();
    user.save(function (err, user) {
      if (err) {
        res.redirect('http://192.168.10.10:4200/users/login?confirmation_fail=true');
        return console.error(err);
      }
      res.redirect('http://192.168.10.10:4200/users/login?confirmation_success=true');
    });
  });
});

// get identities for specific user
router.get('/:user_id/identities', function(req, res) {

  Identity.find({ user_id: req.params.user_id }, function (err, identities) {
    if (err) return console.error(err);
    res.json(identities);
  });
});

// GET user show
router.get('/:user_id', function(req, res) {
  if (req.user) {
    res.json({user: req.user});
  } else {
    res.status(404).send({ error: 'couldnt find user' });
  }
});

// get all users
router.get('/', function(req, res) {

  User.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
    res.json(users);
  });
});

// log user in
//check password and send back jwt token if 
router.post('/login', function(req, res) {
  User.findByIdentification(req.body.identification, function(err, user) {
    if (err) return res.status(404).send({ error: err });

    if (!user) {
      return res.status(404).send({ error: 'couldnt find user' });
    }

    if (!user.checkPassword(req.body.password, user.passwordHash)) {
      console.log('passwords didnt match');
      // incorrect password
      return res.sendStatus(401);
    }

    if (user.confirmed_at == undefined) {
      return res.status('404').end({errors: {'confirmation': "Not Confirmed"}});
    }

    //authentication successfull

    //create token
    var time = [7, 'days'];
    user.createToken(time, function(err, token) {
      //create identity to save token
      var identity = new Identity({ 
        token: token,
        user_id: user.id
      })

      identity.save(function (err, identity) {
        if (err) return res.status(404).send(err);
       
        //send response
        res.json({
          token : token,
          expires: expires,
          user: user.toJSON()
        });
      });
    });
  });
});

// Post user logout
router.post('/logout', function(req, res) {
  if (req.user) {
    //parse token and user_id from headers            
    var session = req.headers["x-access-token"];
    parsed_session = JSON.parse(session);
    var token = parsed_session.user_token;

    //check user identities for token
    var identity = Identity.find({ user_id: req.user.id })
            .where('token').equals(token);
            console.log(identity);
    identity.remove( function(err) {
      
      if (err) return res.status(401).send({ error: err });

      console.log('removal worked!');
      res.end();
    });
  } else {
    res.status(404).send({ error: 'couldnt find user' });
  }
});

//update password
router.post('/update_password', function(req, res) {

  var token = req.body.password_reset_token;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;

  //decode jwt
  var decoded = jwt.decode(token, jwtSecret);

  //check expiration
  if (decoded.exp <= Date.now()) {
    return res.status(401).send({ error: 'token expired' });
  }

  //get user id from decoded token
  var user_id = decoded.iss;

  //find user and confirm if havn't been confirmed yet
  User.findOne({ _id: user_id }, function(err, user) {
    
    if (err) return res.status(401).send({ error: err });

    //send back error if can't find user
    if (!user) {
      return res.status(401).send({ error: 'Your password token is no longer valid. ' + 
                                           'Please restart password changing process' }); 
    }

    if (password !== password_confirmation) {
      return res.status(401).send({ error: 'Password and Password ' + 
                                           'Confirmation do not match' }); 
    }

    User.hashPassword(password, function(err, hash) {

      if (err) {
        return res.status(401).send({ error: err });
      }

      user.passwordHash = hash;

      user.save(function (err, user) {

        if (err) {
          return res.status(401).send({ error: err });
        }

        return res.status(204).end();
      });
    });
  });
});

//connect with facebook (register and login) 
router.post('/auth/:provider', function(req, res) {
  User.connectWithProvider(req, function(err, user, token) {
    
    if (err) return res.status(404).send({ error: err});
    if (!user) return re.status(404).send({ error: "did not find user"});
    if (!token) return re.status(404).send({ error: "did not find token"});
    //send response
    res.json({
      token : token,
      user: user.toJSON()
    });
  });
});

// create user and send back all users after creation
router.post('/', function(req, res) {

  //make sure there are no other user's with that email or username
  var email = req.body.user.email;
  var username = req.body.user.username;
  var password = req.body.user.password;

  //check uniqueness
  User.checkUniqueness(email, username, function(err, message) {
    if (err) return res.status(404).send(err);
    if (message) return res.status(404).send({error: message});

    //hash password
    User.hashPassword(password, function(err, hash) {
      if (err) return res.status(404).send(err);

      //create user
      var user = new User({ 
        username: username,
        email: email,
        passwordHash: hash 
      })

      user.save(function (err, user) {
        if (err) return res.status(404).send(err);

        //create confirmation token
        user.addConfirmationToken(function(err,user) {
          if (err) return res.status(404).send(err);
          res.status('201').json(user);

          //send confirmation email
          user.sendConfirmationEmail(user.username, user.confirmation_token);
        });
      });
    });
  });
});

// delete a user
router.delete('/api/users/:user_id', function(req, res) {
});

module.exports = router;