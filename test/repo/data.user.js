var q = require('q');
var assert = require('assert');
var repo = require('./../../server/data/repo');
var redisClient = require('./../../server/database/redis.js');
var testSeedHelper = require('./../testSeed.helper');

describe('User Repo', function() {
    beforeEach('Flush Redis', function(done) {
        redisClient.flushdb();
        done();
    });

    describe('Function setUser()', function() {
        it('setUser enters a user record [Users] set', function(done) {
            var user = {username: 'tycho.dobbs'};
            var userResult = repo.user.setUser(user, 7200, redisClient);
            userResult.done(function() {
                redisClient.sismember('users', user.username, function(err, res) {
                    assert(res, true);
                    done();
                });
            });
        });
    });

    describe('Function removeUser()', function() {
        it('removes a user from [Users] set', function(done) {
            var user = {username: 'bob.dobbs'};
            repo.user.setUser(user, 7200, redisClient).done(function() {
                repo.user.removeUser(user, redisClient).done(function(err, res) {
                    // Verify the username has been removed from the Set [users]
                    redisClient.sismember('users', user.username, function(err, res) {
                        assert.equal(res, false);

                        // Verify the Hash [bob.dobbs] has been deleted
                        redisClient.keys(user.username, function(err, res) {
                            assert.equal(res, false);
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Function getUser()', function() {
        it('User object is returned if it exists as a Hash', function(done) {
            var seedUser = {username: 'calibos.dobbs'};
            // Seed a fake user to retrieve
            repo.user.setUser(seedUser, 7200, redisClient).done(function() {
                // Search for our seedUser
                var user = repo.user.getUser(seedUser.username, redisClient);
                user.then(function(res) {
                    assert.equal(res.username, seedUser.username);
                    assert.equal(res.totalPoints, 0);
                    assert.equal(res.totalTurns, 0);
                    done();
                });
            }, function(err) {
                throw err;
            });
        });

        it('Returns null result if user is not found as a Hash', function(done) {
            var username = 'hadrian.dobbs';
            var user = repo.user.getUser(username, redisClient);

            user.then(function(res) {
                assert(res === null);
                done();
            });
        });
    });

    describe('Function setUserScore()', function() {
        it('Update user Hash and leaderboards, simulating 3 turns', function(done) {
            var seedUser = {username: 'agamemnon.dobbs'};

            var validateResults = function() {
                redisClient.multi()
                    .hgetall(seedUser.username)
                    .zrank('leaderboard:HighestTotal', seedUser.username)
                    .zrank('leaderboard:HighestAverage', seedUser.username)
                    .exec(function(err, res1) {
                        assert.equal(res1[0].totalPoints, 23);
                        assert.equal(res1[0].totalTurns, 3);
                        assert.equal(res1[1], 0); // 0 index in leaderboard:HighestTotal
                        assert.equal(res1[2], 0); // 0 index in leaderboard:HighestAgerage

                        redisClient.multi()
                            .zrange('leaderboard:HighestTotal', res1[1], 1, 'withscores')
                            .zrange('leaderboard:HighestAverage', res1[2], 1, 'withscores')
                            .exec(function(err, res2) {
                                // Results: [ [ 'agamemnon.dobbs', '23' ], [ 'agamemnon.dobbs', '7.666666666666667' ] ]
                                assert.equal(res2[0][1], 23);
                                assert.equal(res2[1][1], 7.666666666666667);
                                done();
                            });
                    });
            };

            testSeedHelper.createUserWithScores(seedUser, null, redisClient, done, validateResults);
        });
    });

});
