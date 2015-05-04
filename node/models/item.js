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

itemSchema.statics.getAll = function(req, cb) {
  var _this = this;
  this.find(function (err, items) {
    if (err) return cb({error: err});
    return cb(null, items);
  });
};

itemSchema.statics.createItem = function(req, cb) {
  var _this = this;

  //authenticate user
  if (!req.user) return cb({errors: { noUser: "could not authenticate user" }});

  //get item attributes
  var title = req.body.item.title;
  var url = req.body.item.url;
  var user_id = req.user.id;

  //check uniqueness of title and url
  _this.findOne({title: title}, function(err, item) {
    if (err) return cb({error: err});
    if (item) {
      return cb({errors: { title: "Title has already been taken. " + 
          "Please add a more specific title." }});
    }

    //check uniqueness of url
    _this.findOne({url: url}, function(err, item) {
      if (err) return cb({error: err});
      if (item) {
        return cb({errors: { url: "Url has already been taken. " + 
            "Please add a more specific url." }});
      }

      //build item
      var item = new _this({ 
        title: title,
        url: url,
        user_id: user_id
      })

      //save and return item
      item.save(function (err, item) {
        if (err) return cb({error: err});
        return cb(null, item);
      });
    });
  });
};

//define model
module.exports = mongoose.model('Item', itemSchema);