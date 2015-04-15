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
  User.findOne({username: req.body.identification}, function(err, user) {

    if (err) { 
      // user not found 
      console.log('user not found');
      return res.sendStatus(401);
    }

    if (!user.checkPassword(req.body.password, user.passwordHash)) {
      console.log('passwords didnt match');
      // incorrect password
      return res.sendStatus(401);
    }

    //authentication successfull

    //create token
    var expires = moment().add(7, 'days').valueOf();
    var token = jwt.encode({
      iss: user.id,
      exp: expires
    }, jwtSecret);

    //create identity to save token
    var identity = new Identity({ 
      token: token,
      user_id: user.id
    })

    identity.save(function (err, identity) {
      if (err) {
        res.status('404');
        return console.error(err);
      }
     
      //send response
      res.json({
        token : token,
        expires: expires,
        user: user.toJSON()
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
    var user_id = parsed_session.user_id;

    //check user identities for token
    var identity = Identity.find({ user_id: req.user.id })
            .where('token').equals(token);
            console.log(identity);
            identity.remove( function(err) {
              
              if (err) return res.status(401).send({ error: err });

              console.log('removal worked!');
              res.end();
            });

    

    res.json({user: req.user});
  } else {
    res.status(404).send({ error: 'couldnt find user' });
  }
});

// create user and send back all users after creation
router.post('/', function(req, res) {

  //hash password
  var password = req.body.user.password;
  User.hashPassword(password, function(err, hash) {
    if (err) {res.end(err, 400);}

    //create user
    var user = new User({ 
      username: req.body.user.username,
      email: req.body.user.email,
      passwordHash: hash 
    })

    user.save(function (err, user) {
      if (err) {
      	res.status('404');
      	return console.error(err);
      }

      //create confirmation token
      var expires = moment().add(7, 'days').valueOf();
      var token = jwt.encode({
        iss: user.id,
        exp: expires
      }, jwtSecret);

      user.confirmation_token = token;

      user.save(function (err, user) {
        if (err) {
          res.status('404');
          return console.error(err);
        }

        //send response to user
        console.log('user created: ' + user);
        res.status('201').json(user);

        //send confirmation email
        user.sendConfirmationEmail(user.username);
      });
    });
  });
});

// delete a user
router.delete('/api/users/:user_id', function(req, res) {
});

module.exports = router;