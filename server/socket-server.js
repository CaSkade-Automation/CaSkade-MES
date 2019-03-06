module.exports = function (server) {

  var io = require('socket.io').listen(server);

  io.on('connection', (socket) => {
    socket.on('message', (msg) => {
      console.log('message: %s', JSON.stringify(msg));

        // create new example aas
        myAas = {
            "id": 123,
            "name": "myModule", 
            "submodels":[
                {
                    "type": "ontology",
                    "name": "Service-Ontology"
                },
                {
                    "type": "ontology",
                    "name": "KPI-Ontology"
                }
            ]};

      io.emit('module-registration', msg = myAas);
    });
  });
}
