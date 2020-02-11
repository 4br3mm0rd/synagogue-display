// Imports
var express = require('express');

// Routes
var app = express();
require('./routes')(app);

// Processing
app.listen(8080, function(){
    console.log("Running");
})