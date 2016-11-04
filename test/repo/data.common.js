var assert = require('assert');
var repo = require('./../server/data/repo');
var redisClient = require('./../server/database/redis.js');

describe('Common Repo', function() {
    beforeEach('Flush Redis', function(done) {
        redisClient.flushdb();
        done();
    });

    describe('getNextSessionId()', function() {
        it('Increments by 1', function(done) {
            repo.common.getNextSessionId(redisClient).done(function(err) {
                throw err;
            }, function(nextSessionId) {
                assert.equal(nextSessionId, 1);
            });

            repo.common.getNextSessionId(redisClient).done(function(err) {
                throw err;
            }, function(nextSessionId) {
                assert.equal(nextSessionId, 2);
                done();
            });
        });
    });
});
