console.log('In redis.js');
var env = process.env.NODE_ENV;

var redis = require('redis');

if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
}

if (env === 'test') {
    client.select(4);
}

// TODO: Should I be closing the client as well?

module.exports = client;

// var socketio = require('socket.io');
//
// module.exports = initSockets;
//
// function initSockets (server, client) {
//     var io = socketio.listen(server);
//
//     io.on('connection', function(socket) {
//
//         function serverError(err, message) {
//             console.log(err);
//             socket.emit('serverError', {message: message});
//         }
//     });
// }
