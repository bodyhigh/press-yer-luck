var socketio = require('socket.io');
var repo = require('./../data/repo');
var User = require('./../data/user.model');
var io;

module.exports = initSockets;

function initSockets (server, client) {
    io = socketio.listen(server);

    var general = io.on('connect', function(socket) {
        repo.leaderboard.getTotalLeaderboard(client).then(function(leaderboard) {
            socket.emit('refreshTotalLeaderboard', leaderboard);
        });

        repo.leaderboard.getAverageLeaderboard(client).then(function(leaderboard) {
            socket.emit('refreshAverageLeaderboard', leaderboard);
        });

        socket.on('refreshLeaderboards', function(msg) {
            refreshLeaderboards(client);
        });
    });

}

function refreshLeaderboards(redisClient) {
    repo.leaderboard.getTotalLeaderboard(redisClient).then(function(leaderboard) {
        io.emit('refreshTotalLeaderboard', leaderboard);
    });

    repo.leaderboard.getAverageLeaderboard(redisClient).then(function(leaderboard) {
        io.emit('refreshAverageLeaderboard', leaderboard);
    });
}
