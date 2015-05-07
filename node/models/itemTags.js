// load mongoose since we need it to define a model
var mongoose = require('mongoose'),
		transporter = require('../config/email'),
    moment = require('moment'),
    User = require('./user'),
    Item = require('./item'),
    ENV = require('../config/environment');

var Schema = mongoose.Schema;

//define schema
var itemTagsSchema = new Schema({
  item_id: String,
  tag_id: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

itemTagsSchema.statics.addTags = function(item, tags, cb) {
  var _this = this;
  var tag;
  var itemId = item.id;

  //use recursive pattern to create itemTags

  //array of created itemTags
  var itemTags;

  processTags(tags);

  function processTags(tags) {
    var currentTag;

    if tags.length == 0) {
      //All queries complete
      return cb(null, itemTags);
    }

    //get and remove last element of tags array
    currentTag = tags.pop();

    //find tag
    Tag.find({title: currentTag}, function(err, tag) {
      if (err) console.log(err); 
      if (tag) {

        //build itemTag
        var itemTag = new _this({
          tag_id: tag.id,
          item_id: item.id
        });

        itemTag.save(function(err, itemTag) {
          if (err) console.log(err);
          itemTags.push(itemTag);

          //next round
          processTags(tags);
        });
      } else {
        //next round
        processTags(tags);
      }
    });
  }
}

//define model
module.exports = mongoose.model('ItemTags', itemTagsSchema);