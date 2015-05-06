// load mongoose since we need it to define a model
var mongoose = require('mongoose'),
    moment = require('moment'),
    User = require('./user'),
    ENV = require('../config/environment');

var Schema = mongoose.Schema;

//define schema
var tagSchema = new Schema({
  name: { type: String, unique: true, sparse: true },  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

//define model
module.exports = mongoose.model('Tag', tagSchema);