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

//POST ----------------------------------------------------------------------

//create item
router.post('/', function(req, res) {

	//call create item function
	Item.createItem(req, function(err, data) {

		if (err) return res.status(404).send(err);

		return res.status(201).send(data);
	});

});

//DELETE

//export
module.exports = router;