var assert = require('assert');
var http = require('http');
var redisClient = require('./../../server/database/redis.js');
var repo = require('./../../server/data/repo');
var testSeedHelper = require('./../testSeed.helper');
var socketio = require('./../../server/socket/socket');

var io = require('socket.io-client');

describe('Socket.io Test', function() {
    var socket,
        server = http.createServer().listen(0),
        options = {
            transports: ['websocket'],
            'force new connection': true
        };

    socketio(server, redisClient);

    beforeEach(function(done) {
        var socketSetup = function() {
            // Socket Setup
            socket = io.connect('http://127.0.0.1:' + server.address().port, options);

            socket.on('connect', function() {
                var msg = 'connected to test client';
                // console.log(msg);
                done();
            });

            socket.on('disconnect', function() {
                var msg = 'disconnected from client';
                // console.log(msg);
            });
        };

        // Redis Setup
        redisClient.flushdb();
        testSeedHelper.createUserWithScores({username: 'amitabha.dobbs'}, null, redisClient, done, socketSetup);
        // redisClient.zrange('leaderboard:HighestTotal', 0, -1, 'withscores', function(err, res) {
        //     if (err) {
        //         console.log('!!!!!!!!!!!! ERROR: ' + err);
        //     } else {
        //         console.dir(res);
        //     }
        // });
    });

    afterEach(function(done) {
        if (socket.connected) {
            var msg = 'disconnecting ...';
            // console.log(msg);
            socket.disconnect();
        } else {
            console.log('no connection to break');
        }
        done();
    });

    describe('Broadcast Total Leaderboard on emitting [refreshLeaderboards]', function() {
        it('Receiving new leaderboard stats', function(done) {
            socket.on('refreshTotalLeaderboard', function(msg) {
                assert.equal(msg[0].username, 'amitabha.dobbs');
                assert.equal(msg[0].score, 23);
                done();
            });

            socket.emit('refreshLeaderboards', {msg: 'ima client'});
        });
    });

    describe('Broadcast Average Leaderboard on emitting [refreshLeaderboards]', function() {
        it('Receiving new leaderboard stats', function(done) {
            socket.on('refreshAverageLeaderboard', function(msg) {
                assert.equal(msg[0].username, 'amitabha.dobbs');
                assert.equal(msg[0].score, 7.666666666666667);
                done();
            });

            socket.emit('refreshLeaderboards', {msg: 'ima client'});
        });
    });
});
