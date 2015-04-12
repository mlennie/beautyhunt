var express = require('express');
var router = express.Router();

// load the user model
var User = require('../models/user');

// api ---------------------------------------------------------------------

//delete all users
router.get('/delete_all', function(req, res) {
  User.remove({}, function(err) { 
     console.log('users removed');
     res.sendStatus(200);
  });
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

    // User has authenticated OK
    console.log('passwords matched!');
    res.status('200').json(req.body);
  });
  
});

// create user and send back all users after creation
router.post('/', function(req, res) {

  //hash password
  var password = req.body.user.password;
  User.hashPassword(password, function(err, hash) {
    if (err) return console.error(err);

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
      //send response to user
      console.log('user created: ' + user);
      res.status('201').json(user);

      //send confirmation email
      user.sendConfirmationEmail(user.username);

    });
  });
});

// delete a user
router.delete('/api/users/:user_id', function(req, res) {
});

module.exports = router;