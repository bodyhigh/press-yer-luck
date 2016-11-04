var assert = require('assert');
var repo = require('./../server/data/repo');
var redisClient = require('./../server/database/redis.js');
var testSeedHelper = require('./testSeed.helper');

describe('Leaderboard Repo', function() {
    beforeEach('Flush Redis', function(done) {
        redisClient.flushdb();
        done();
    });

    describe('Function getTotalLeaderboard()', function() {
        it('Returns the Total Points Leaderboard with scores in descending order', function(done) {
            var leaderboard = testSeedHelper.createUser();
            console.log(leaderboard);
            // assert.equal(leaderboard.)
            done();
        });
    });
});
