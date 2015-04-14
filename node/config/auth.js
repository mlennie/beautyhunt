var User = require('../models/user'),
		Identity = require('../models/identity');
var jwt = require('jwt-simple');

var jwtSecret = 'xxx';
 
module.exports = function(req, res, next) {

	//check to see if headers has x-access-token
	if (req.headers["x-access-token"]) {
		//3 ways we could get access token
	  /*(req.body && req.body.access_token) || 
	  						(req.query && req.query.access_token) || 
	  						req.headers["x-access-token"];*/

	  //parse token and user_id from headers						
	  var session = req.headers["x-access-token"];
	  parsed_session = JSON.parse(session);
	  var token = parsed_session.user_token;
	  var user_id = parsed_session.user_id;

	  //check presence of token
	  if (token) {
		  try {

		  	//decode jwt
		    var decoded = jwt.decode(token, jwtSecret);
		 
		    //check expiration
		    if (decoded.exp <= Date.now()) {
				  res.status(401).send({ error: 'token expired' });
				}

				//make sure id sent with session matches decoded id
				if (user_id !== decoded.iss) {
					res.status(401).send({ error: 'token not valid' });
				}

				//find and add user to req object
				User.findOne({ _id: decoded.iss }, function(err, user) {

					if (err) return console.error(err);

					//check user identities for token
			  	Identity.find({ user_id: user.id })
			  					.where('token').equals(token)
			  					.exec(function (err, identities) {
			  		
			  		if (err) return console.error(err);
	    			console.log(identities);
	    			if (identities.length == 0) {
	    				res.status(401).send({ error: 'token not valid' });
						} else {
							//add user to req object and return 
						  req.user = user;
						  return next();
						}

					});
				});
		 
		  } catch (err) {
		    return next();
		  }
		} else {
		  return next();
		}
	} else {
		return next();
	}
};