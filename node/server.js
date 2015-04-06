var express = require('express'),
		mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    database = require('./config/database');

var app = express();

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// connect to mongoDB database on modulus.io
mongoose.connect(database.url); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

	require('./routes')(app);
 
	app.listen(database.port);
	console.log('Running on http://localhost:' + database.port);
});
 
