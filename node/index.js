var express = require('express'),
		bcrypt = require('bcryptjs');
    bodyParser = require('body-parser');
 
var PORT = process.env.PORT || 8080;
 
var app = express();

var hashPassword = function (user, callback) {
  bcrypt.hash(user.password, 10, function(error, hash) {
    if (error) throw error;
    user.password = hash;
    callback(null, user);
	}); 
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function( req, res) {
  res.send('Hello yoda!!');
});

app.post('/users', function( req, res) {
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
    	bcrypt.compare(req.body.password, hash, function(err, response) {
	    	var passwordEqualsHash = response == true;
	    	res.json({hash: hash, comparison: passwordEqualsHash.toString()});
			});
    });
	});
});

 
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);