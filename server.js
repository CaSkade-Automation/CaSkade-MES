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
app.use(bodyParser.urlencoded({'extended':'true'}));      // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                               // parse application/json
app.use(bodyParser.text());


// serve static assets with express (angular's dist folder needs to be mentioned here, too)
app.use(express.static(__dirname + '/public'));
app.use(express.static('dist'));


// start app ======================================
app.use('/uploaded-files', express.static(__dirname + '/server/uploaded-files')); //Serves resources from public folder
var server = app.listen(SERVER_PORT);

// start socket-server
var SocketServer = require('./server/socket-server');
var socketServer = new SocketServer(server);

// api routing
// TODO: if a lot of routes are added later we have to have a central route file (otherwise we include a lot of files here)

// Create an instance of a graphDB connection database
GraphDBConnection = require('./server/util/graphDbConnection');
graphDBConnection = new GraphDBConnection();

var moduleRoutes = require('./server/routes/module-management.route')(socketServer, graphDBConnection);
app.use('/api/modules', moduleRoutes);

var moduleServiceRoutes = require('./server/routes/service-management.route')(socketServer, graphDBConnection);
app.use('api/module-services/', moduleServiceRoutes);

var orderManagementRoutes = require('./server/routes/order-management.route');
app.use('/api/order-management', orderManagementRoutes);

var graphOperationsRoutes = require('./server/routes/graph-operations.route')(graphDBConnection);
app.use('/api/graph-operations', graphOperationsRoutes);

var graphDbManagementRoutes = require('./server/routes/graph-repositories.route')(graphDBConnection);
app.use('/api/graph-repositories', graphDbManagementRoutes);

var serviceExecutionRoutes = require('./server/routes/service-execution.route');
app.use('/api/service-executions', serviceExecutionRoutes);

// load the single view file, angular does all the front-end-routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });




console.log(`app listening on port ${SERVER_PORT}`);