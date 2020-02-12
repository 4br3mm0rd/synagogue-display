// Imports
var express = require('express');

// Routes
var app = express();
app.use(express.static('public'));
require('./routes')(app);

// Processing
app.listen(8080, function(){
    console.log("Running");
})