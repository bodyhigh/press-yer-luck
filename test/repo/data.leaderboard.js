var assert = require('assert');
var repo = require('./../../server/data/repo');
var redisClient = require('./../../server/database/redis.js');
var testSeedHelper = require('./../testSeed.helper');

describe('Leaderboard Repo', function() {
    beforeEach('Flush Redis', function(done) {
        redisClient.flushdb();
        done();
    });

    describe('Function getTotalLeaderboard()', function() {
        it('Returns the Total Points Leaderboard with scores in descending order', function(done) {
            var seedUser = [
                {username: 'whiskey.dobbs'},
                {username: 'tango.dobbs'},
                {username: 'foxtrot.dobbs'}
            ];

            var validateResults = function() {
                repo.leaderboard.getTotalLeaderboard(redisClient)
                    .then(function(leaderboard) {
                        try {
                            assert.equal(leaderboard[0].username, 'foxtrot.dobbs', 'Expected to return the username foxtrot.dobbs');
                            assert.equal(leaderboard[0].score, '66');
                            assert.equal(leaderboard[1].username, 'whiskey.dobbs', 'Expected to return the username whiskey.dobbs');
                            assert.equal(leaderboard[1].score, '23');
                            assert.equal(leaderboard[2].username, 'tango.dobbs', 'Expected to return the username tango.dobbs');
                            assert.equal(leaderboard[2].score, '1');
                            assert(leaderboard[0].score > leaderboard[1].score, 'Expected leaderboard[0] to be larger than leaderboard[1]');
                            assert(leaderboard[1].score > leaderboard[2].score, 'Expected leaderboard[1] to be larger than leaderboard[2]');
                            done();
                        } catch (ex) {
                            done(ex);
                        }

                    }, done);
            };

            testSeedHelper.createThreeUsersWithScores(seedUser, redisClient, done, validateResults);
        });
    });

    describe('Function getAverageLeaderboard()', function() {
        it('Returns the Average Points Leaderboard with scores in descending order', function(done) {
            var seedUser = [
                {username: 'whiskey.dobbs'},
                {username: 'tango.dobbs'},
                {username: 'foxtrot.dobbs'}
            ];

            var validateResults = function() {
                repo.leaderboard.getAverageLeaderboard(redisClient)
                    .then(function(leaderboard) {
                        try {
                            assert.equal(leaderboard[0].username, 'foxtrot.dobbs', 'Expected to return the username foxtrot.dobbs');
                            assert.equal(leaderboard[0].score, '22.00');
                            assert.equal(leaderboard[1].username, 'whiskey.dobbs', 'Expected to return the username whiskey.dobbs');
                            assert.equal(leaderboard[1].score, '7.666666666666667');
                            assert.equal(leaderboard[2].username, 'tango.dobbs', 'Expected to return the username tango.dobbs');
                            assert.equal(leaderboard[2].score, '0.3333333333333333');
                            assert(leaderboard[0].score > leaderboard[1].score,
                                'Expected leaderboard[0] (' + leaderboard[0].score + ') to be larger than leaderboard[1] (' + leaderboard[1].score + ')');
                            assert(leaderboard[1].score > leaderboard[2].score,
                                'Expected leaderboard[1] (' + leaderboard[1].score + ') to be larger than leaderboard[2] (' + leaderboard[2].score + ')');
                            done();
                        } catch (ex) {
                            done(ex);
                        }

                    }, done);
            };

            testSeedHelper.createThreeUsersWithScores(seedUser, redisClient, done, validateResults);
        });
    });

});
