console.log('In socket.js');
var socketio = require('socket.io');

module.exports = initSockets;

function initSockets (server, client) {
    console.log('In initSockets');
    var io = socketio.listen(server);

    io.on('connection', function(socket) {

        function serverError(err, message) {
            console.log(err);
            socket.emit('serverError', {message: message});
        }
    });
}
