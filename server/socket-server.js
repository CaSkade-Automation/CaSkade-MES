class SocketServer {
  constructor(server) {
    this.server = server;
    this.io = require('socket.io').listen(server);
    this.waitForConnection();
  }


  waitForConnection() {
    this.io.on('connection', (socket) => {
      console.log("socket connection");

      socket.on('message', (msg) => {
        console.log('message: %s', JSON.stringify(msg));
      });
    });
  }
  

  emitNewSelfDescription (selfDescription) {
    this.io.emit('moduleregistration', selfDescription);
  };


  /**
   * Emits a mesage with the 'moduleregistration'-event
   * @param {string} message The message to be emitted
   */
  emitModuleRegistrationEvent(message) {
    this.io.emit('moduleregistration', message);
  }

}

module.exports = SocketServer;


// module.exports = function (server) {

//   var io = require('socket.io').listen(server);

//   io.on('connection', (socket) => {
//     socket.on('message', (msg) => {
//       console.log('message: %s', JSON.stringify(msg));

//         // create new example aas
//         myAas = {
//             "id": 123,
//             "name": "myModule", 
//             "submodels":[
//                 {
//                     "type": "ontology",
//                     "name": "Service-Ontology"
//                 },
//                 {
//                     "type": "ontology",
//                     "name": "KPI-Ontology"
//                 }
//             ]};

//       io.emit('module-registration', msg = myAas);
//     });
//   });

//   emitNewSelfDescription (selfDescription) {
//     io.emit('module-registration', msg = selfDescription);
//   };

// }
