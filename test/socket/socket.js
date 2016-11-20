var assert = require('assert');
var http = require('http');
var redisClient = require('./../../server/database/redis.js');
var repo = require('./../../server/data/repo');
var testSeedHelper = require('./../testSeed.helper');
var socketio = require('./../../server/socket/socket');
var io = require('socket.io-client');

var socketio2 = require('socket.io');

var options = {
    transports: ['websocket'],
    'force new connection': true
};

console.log('IN SOCKET TEST');
describe('Socket.io Test', function() {
    var ioclient,
        ioclient2,
        server = http.createServer().listen(0);

    var io2 = socketio2.listen(server);
    var general = io2.on('connection', function(socket) {
        console.log('connecting to general');
        socket.on('pushTotalLeaderboard', function(msg) {
            console.log('NOW IN PUSH');
            io.emit('catchTotalLeaderboard', msg);
        });
    });

    socketio(server, redisClient);

    beforeEach(function(done) {
        // ioclient = io('http://localhost:' + server.address().port, options);
        // ioclient2 = io('http://localhost:' + server.address().port + '/user', options);

        done();
        // ioclient.on('connect', function() {
        //     ioclient2.on('connect', function() {
        //         repo.user.setUser({username: 'ashok.dobbs'}, 7200, redisClient).done(function() {
        //             repo.user.setUser({username: 'Made.dobbs'}, 7200, redisClient).done(function() {
        //                 done();
        //             }, done);
        //         }, done);
        //     });
        // });

        // // Populate the leaderboards
        // var seedUser = [
        //     {username: 'whiskey.dobbs'},
        //     {username: 'tango.dobbs'},
        //     {username: 'foxtrot.dobbs'}
        // ];
        // testSeedHelper.createThreeUsersWithScores(seedUser, redisClient, done, done);
    });

    describe('Broadcast Total Leaderboard on setUserScore()', function() {
        it('testing nothing', function(done) {
            // ioclient.on('catchTotalLeaderboard', function(msg) {
            //     console.log('Got the message: ' + msg);
            //     assert.equal(msg, 'some message');
            //     done();
            // });

            // io2.emit('pushTotalLeaderboard', 'some message');
            var clients = io2.sockets.clients();
            console.log('client len: ' + clients.length);
            for (var i = 0; i < clients.length; i++) {
                console.log('ITERATE');
                clients[i].emit('pushTotalLeaderboard', 'some message');
            }
        });
    });

    // afterEach(function() {
    //     ioclient.disconnect();
    //     // ioclient2.disconnect();
    // });
});
