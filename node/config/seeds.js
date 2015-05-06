var mongoose = require('mongoose'),
    database = require('./database'),
    moment = require('moment'),
    User = require('../models/user'),
    Item = require('../models/item');


//connect to mongoDB database on modulus.io
mongoose.connect(database.url); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

	//USERS
	//create user if doesn't exist
	User.find({username: jimbo}, function(err, user) {
		if (!user) {
			//hash password
		  User.hashPassword("password", function(err, hash) {
		    if (err) return console.log(err);

				var user = new User({
					username: "jimbo",
					email: "jimbobob@gmail.com",
					passwordHash: hash,
					confirmed_at: new Date
				})

				user.save(function (err, user) {
					if (err) return console.log(err);
					console.log(user);
				});
			});
		}
	});

	//TAGS
	
});