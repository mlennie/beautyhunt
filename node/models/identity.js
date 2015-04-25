var mongoose = require('mongoose'),
	  User = require('./user');

var Schema = mongoose.Schema;

//define schema
var identitySchema = new Schema({
  token: String,
  user_id: String
});

//methods

identitySchema.statics.createIdentity = function(token, id, cb ) {
	//create identity to save token
  var identity = new this({ 
    token: token,
    user_id: id
  })

  identity.save(function (err, identity) {
    if (err) return cb(err);
    if (!identity) return cb({error: "could not create identity"});
    return cb(null, identity)
  });
};

//define model
module.exports = mongoose.model('Identity', identitySchema);
