var express = require('express');
 
var PORT = process.env.PORT || 8080;
 
var app = express();
app.get('/', function( req, res) {
  res.send('Hello yoda!');
});
 
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);