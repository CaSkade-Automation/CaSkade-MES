//basic set up ========================
var express  = require('express');
var app = express();                                   // creating the app with express
var mongoose = require('mongoose');                            // mongoose for mongodb
var morgan = require('morgan');                                // log requests to the console (express4)
var bodyParser = require('body-parser');                       // pull information from HTML POST (express4)
var path = require('path');

var SERVER_PORT = 9090;

// registration testing
var multicast = require('./server/registration');

var config = require('./server/config');

//mongoose.connect(config.databaseUrl, {useNewUrlParser : true});                        // connect to mongoDB

app.use(morgan('dev'));                                   // log every request to the console
app.use(bodyParser.text());
app.use(bodyParser.json());                               // parse application/json
app.use(bodyParser.urlencoded({'extended':'true'}));      // parse application/x-www-form-urlencoded


// serve static assets with express (angular's dist folder needs to be mentioned here, too)
app.use(express.static(__dirname + '/public'));
app.use(express.static('dist'));


// start app ======================================
var server = app.listen(SERVER_PORT);

// start socket-server
var SocketServer = require('./server/socket-server');
var socketServer = new SocketServer(server);
socketServer.waitForConnection();


//CORS Middleware
// app.use(function (req, res, next) {  
//   //Enabling CORS
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
//   next();
//  });

// api routing
// TODO: if a lot of routes are added later we have to have a central route file (otherwise we would have to include a lot of files here)

GraphDBConnection = require('./server/util/graphDbConnection');
graphDBConnection = new GraphDBConnection();

var moduleManagementRoutes = require('./server/routes/module-management.routes')(socketServer, graphDBConnection);
app.use('/api/modules', moduleManagementRoutes);

var orderManagementRoutes = require('./server/routes/order-management.routes');
app.use('/api/order-management', orderManagementRoutes);

var graphDbManagementRoutes = require('./server/routes/graph-repositories.route');
app.use('/api/graph-repositories', graphDbManagementRoutes);

// load the single view file, angular does all the front-end-routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

console.log(`app listening on port ${SERVER_PORT}`);