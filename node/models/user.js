// load mongoose since we need it to define a model
var mongoose = require('mongoose'),
	  bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

//define schema
var userSchema = new Schema({
  username: String,
  email: String,
  passwordHash: String
});

//methods
userSchema.methods.checkPassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
};

//define model
module.exports = mongoose.model('User', userSchema);

