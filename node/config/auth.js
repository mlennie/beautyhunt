var User = require('../models/user');
var jwt = require('jwt-simple');

var jwtSecret = 'xxx';
 
module.exports = function(req, res, next) {
	if (req.headers["x-access-token"]) {

		//console.log(req.headers['x-access-token']);
	  var token = (req.body && req.body.access_token) || 
	  						(req.query && req.query.access_token) || 
	  						req.headers["x-access-token"]["user_token"];
	  var session = req.headers["x-access-token"];
	  parsed_session = JSON.parse(session);
	  var token = parsed_session.user_token;

	  if (token) {
		  try {
		    var decoded = jwt.decode(token, jwtSecret);
		 
		    if (decoded.exp <= Date.now()) {
				  res.end('Access token has expired', 400);
				}

				
				User.findOne({ _id: decoded.iss }, function(err, user) {
				  req.user = user;
				});
		 
		  } catch (err) {
		    return next();
		  }
		} else {
		  next();
		}
	} else {
		next();
	}
};