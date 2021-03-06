var express = require('express'),
		mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    database = require('./config/database'),
    users = require('./routes/users'),
    items = require('./routes/items'),
    identities = require('./routes/identities'),
    auth = require('./config/auth');

var app = express();

//CORS
app.use(function(req, res, next) {
  //console.log(req.headers);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//connect to mongoDB database on modulus.io
mongoose.connect(database.url); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

  //Authenticate user
  app.use('/api/*', auth);

  app.use('/api/users', users);
  app.use('/api/items', items);
  app.use('/api/identities', identities);
	app.get('*', function(req, res) { res.send('Hello yoda!!'); });

  //catch all error handler
  app.use(function (err, req, res, next) {
    res.status(500);
    return res.render('error', { error: err });
  });
 
	app.listen(database.port);
	console.log('Running on http://localhost:' + database.port);
});
 
