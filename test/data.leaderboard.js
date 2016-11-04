var assert = require('assert');
var repo = require('./../server/data/repo');
var redisClient = require('./../server/database/redis.js');

describe('Leaderboard Repo', function() {
    beforeEach('Flush Redis', function(done) {
        redisClient.flushdb();
        done();
    });

});
