var express = require('express'),
		mongoose = require('mongoose'),
		bcrypt = require('bcryptjs'),
		nodemailer = require('nodemailer'),
		nodemailerHandlebars = require('nodemailer-express-handlebars'),
    bodyParser = require('body-parser');

var mailerOptions = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/email/',
         defaultLayout : 'template',
         partialsDir : 'views/partials/'
     },
     viewPath: 'views/email/',
     extName: '.hbs'
 };
 
var PORT = process.env.PORT || 8080;
 
var app = express();

//EMAILING: create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'beautyhuntapp@gmail.com',
        pass: 'beautyhunt123'
    }
});
transporter.use('compile', nodemailerHandlebars(mailerOptions));

var IP = process.env.MONGODB_PORT_27017_TCP_ADDR
var MONGOPORT = process.env.MONGODB_PORT_27017_TCP_PORT
mongoose.connect('mongodb://' + IP + ':' + MONGOPORT + '/' + 'beauty-dev');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

		//encrypt password
		var password = req.body.user.password
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return console.error(err);
	    bcrypt.hash(password, salt, function(err, hash) {
	    	if (err) return console.error(err);

	    	//create user
	    	var user = new User({ 
	    		username: req.body.user.username,
	    		email: req.body.user.email,
	    		passwordHash: hash 
	    	})
	    	user.save(function (err, user) {
				  if (err) return console.error(err);

				  // send email
				  // setup e-mail data with unicode symbols 
					var confirmMailOptions = {
					    from: 'Beauty Hunt <no-reply@beautyhunt.com>', 
					    to: 'montylennie@gmail.com', 
					    subject: 'Please confirm your account', 
					    text: 'please confirm your account',  
					    template: 'user_confirm',
					    context: {
			          username: user.username,
			          confirmLink: "<<link to confirm account>>"
				     }
					};

					// send mail with defined transport object 
					transporter.sendMail(confirmMailOptions, function(error, info){
					    if(error){
					        console.log(error);
					        transporter.close();
					        res.status('404');
					    }else{
				        console.log('Message sent: ' + info.response);
				        transporter.close();
				        //send response to user
							  console.log('user created: ' + user);
							  res.status('201').json(user);
					    }
					});
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


