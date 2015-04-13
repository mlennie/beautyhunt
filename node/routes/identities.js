var express = require('express');
var router = express.Router();

var User = require('../models/user'),
    Identity = require('../models/identity');

// api ---------------------------------------------------------------------

//get all identities
router.get('/', function(req, res) {
  Identity.find(function (err, identities) {
    if (err) return console.error(err);
    res.json(identities);
  });
});

module.exports = router;