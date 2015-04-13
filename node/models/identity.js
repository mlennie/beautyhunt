var mongoose = require('mongoose'),
	  User = require('./user');

var Schema = mongoose.Schema;

//define schema
var identitySchema = new Schema({
  token: String,
  user_id: String
});

//methods

//define model
module.exports = mongoose.model('Identity', identitySchema);
