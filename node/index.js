var express = require('express'),
		mongoose = require('mongoose'),
		bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser');
 
var PORT = process.env.PORT || 8080;
 
var app = express();

var IP = process.env.MONGODB_PORT_27017_TCP_ADDR
var MONGOPORT = process.env.MONGODB_PORT_27017_TCP_PORT
mongoose.connect('mongodb://' + IP + ':' + MONGOPORT + '/' + 'beauty-dev');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

  var userSchema = mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String
	});

	var User = mongoose.model('User', userSchema);

	app.get('/', function( req, res) {
	  res.send('Hello yoda!!');
	});

	app.post('/users', function(req, res) {
		bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(req.body.password, salt, function(err, hash) {
	    	var user = new User({ 
	    		username: req.body.username,
	    		email: req.body.email,
	    		passwordHash: hash 
	    	})
	    	user.save(function (err, user) {
				  if (err) return console.error(err);
				  console.log('user created: ' + user);
				  res.send('user created: ' + user);
				});
	    });
		});
	});

	app.get('/users', function(req, res) {
		User.find(function (err, users) {
		  if (err) return console.error(err);
		  console.log(users);
		  res.json(users);
		});
	});	

 
	app.listen(PORT);
	console.log('Running on http://localhost:' + PORT);
});


