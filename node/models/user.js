// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    username: String,
    email: String,
    passwordHash: String
});