var socketio = require('socket.io');
var repo = require('./../data/repo');
var User = require('./../data/user.model');
console.log('In socket.js');

module.exports = initSockets;

function initSockets (server, client) {
    console.log('In initSockets');
    var io = socketio.listen(server);

    var users = io.of('/user').on('connection', function(socket) {
        var user;

        function serverError(err, message) {
            console.log(err);
            socket.emit('serverError', {message: message});
        }

        socket.on('score', function(username, score, cb) {
            user = new User(username, score, socket.id);
        });
    });

    var general = io.on('connection', function(socket) {
        socket.on('pushTotalLeaderboard', function(msg) {
            console.log('NOW IN PUSH');
            io.emit('catchTotalLeaderboard', msg);
        });
    });
}
