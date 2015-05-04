//require dependencies
var express = require('express'),
    User = require('../models/user'),
    Item = require('../models/item'),
    ENV = require('../config/environment'),
    moment = require('moment');

//setup router   
var router = express.Router();

// api ----------------------------------------------------------------------

//GET

//get items
router.get('/', function(req, res) {
	Item.getAll(req, function(err, items) {
		if (err) return res.status(404).send(err);
		return res.status(201).send({items: items});
	});
});

//POST ----------------------------------------------------------------------

//create item
router.post('/', function(req, res) {
	Item.createItem(req, function(err, item) {
		if (err) return res.status(404).send(err);
		return res.status(200).send({items: [item]});
	});

});

//DELETE

//export
module.exports = router;