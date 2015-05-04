// load mongoose since we need it to define a model
var mongoose = require('mongoose'),
		transporter = require('../config/email')
    moment = require('moment'),
    User = require('./user'),
    ENV = require('../config/environment');

var Schema = mongoose.Schema;

//define schema
var itemSchema = new Schema({
  title: { type: String, unique: true, sparse: true },
  url: { type: String, unique: true, sparse: true },
  user_id: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

itemSchema.statics.createItem = function(req, cb) {
  //authenticate user
  if (!req.user) return cb({error: "could not authenticate user"});

  //get item attributes
  var title = req.body.item.title;
  var url = req.body.item.url;
  var user_id = req.user.id;

  //build item
  var item = new this({ 
    title: title,
    url: url,
    user_id: user_id
  })

  //save and return item
  item.save(function (err, item) {
    if (err) return cb({error: err});
    return cb(null, item);
  });
};

//define model
module.exports = mongoose.model('Item', itemSchema);