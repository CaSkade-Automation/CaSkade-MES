//basic set up ========================
var express  = require('express');
var app = express();                                   // creating the app with express
var mongoose = require('mongoose');                            // mongoose for mongodb
var morgan = require('morgan');                                // log requests to the console (express4)
var bodyParser = require('body-parser');                       // pull information from HTML POST (express4)
var path = require('path');

// registration testing
var multicast = require('./server/registration');

var config = require('./server/config');

mongoose.connect(config.databaseUrl);                        // connect to mongoDB

app.use(morgan('dev'));                                   // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));      // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                               // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));    // parse application/vnd.api+json as json

// serve static assets with express (angular's dist folder needs to be mentioned here, too)
app.use(express.static(__dirname + '/public'));
app.use(express.static('dist'));

// api routing
// TODO: if a lot of routes are added later we have to have a central route file (otherwise we would have to include a lot of files here)
var moduleManagementRoutes = require('./server/routes/module-management.routes');
app.use('/api/module-management', moduleManagementRoutes);

var orderManagementRoutes = require('./server/routes/order-management.routes');
app.use('/api/order-management', orderManagementRoutes);

// load the single view file, angular does all the front-end-routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// start app ======================================
var server = app.listen(8080);

// start socket-server
var socket_communication = require('./server/socket-server')(server);


console.log("app listening on port 8080");