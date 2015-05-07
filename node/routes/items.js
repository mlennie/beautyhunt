//require dependencies
var express = require('express'),
    User = require('../models/user'),
    Item = require('../models/item'),
    Tag = require('../models/tag'),
    ItemTags = require('../models/itemTags'),
    ENV = require('../config/environment'),
    moment = require('moment');

//setup router   
var router = express.Router();

// api ----------------------------------------------------------------------

//GET

//get items
router.get('/', function(req, res) {
	Item.getAll(req, function(err, items) {
		if (err) return res.status(404).send({error: err});
		Tag.find({}, function(err, tags) {
			if (err) return res.status(404).send({error: err});
			ItemTags.find({}, function(err, itemTags) {
				if (err) return res.status(404).send({error: err});

				return res.status(200).send({items: items, tags: tags, "item-tags": itemTags});
			});
		});
	});
});

//POST ----------------------------------------------------------------------

//create item
router.post('/', function(req, res) {
	Item.createItem(req, function(err, item, itemTags) {
		if (err) return res.status(404).send({error: err});
		return res.status(201).send({items: [item], itemTags: [itemTags]});
	});

});

//DELETE

//export
module.exports = router;