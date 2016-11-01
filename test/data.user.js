var assert = require('assert');
var repo = require('./../server/data/repo');
var redisClient = require('./../server/database/redis.js');

describe('User Repo', function() {
    beforeEach('Flush Redis', function(done) {
        // redisClient.flushdb();
        done();
    });

    describe('setUser()', function() {
        it('setUser enters a user record [Users] set', function(done) {
            var username = 'tycho.dobbs';
            var user = repo.user.setUser(username, 7200, redisClient);
            user.done(function() {
                redisClient.sismember('users', username, function(err, res) {
                    assert(res, true);
                    done();
                });
            });
        });
    });

    describe('removeUser()', function() {
        it('removes a user from [Users] set', function(done) {
            var username = 'bob.dobbs';
            repo.user.setUser(username, 7200, redisClient).done(function() {
                repo.user.removeUser(username, redisClient).done(function(err, res) {
                    redisClient.sismember('users', username, function(err, res) {
                        assert.equal(res, false);
                        done();
                    });
                });
            });
        });
    });
});
