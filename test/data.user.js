var assert = require('assert');
var repo = require('./../server/data/repo');
var redisClient = require('./../server/database/redis.js');

describe('User Repo', function() {
    beforeEach('Flush Redis', function(done) {
        redisClient.flushdb();
        done();
    });

    describe('setUser()', function() {
        it('setUser enters a user record [Users] set', function(done) {
            var user = {username: 'tycho.dobbs'};
            var userResult = repo.user.setUser(user.username, 7200, redisClient);
            userResult.done(function() {
                redisClient.sismember('users', user.username, function(err, res) {
                    assert(res, true);
                    done();
                });
            });
        });
    });
    //
    // describe('removeUser()', function() {
    //     it('removes a user from [Users] set', function(done) {
    //         var user = {username: 'bob.dobbs'};
    //         repo.user.setUser(user.username, 7200, redisClient).done(function() {
    //             repo.user.removeUser(user.username, redisClient).done(function(err, res) {
    //                 redisClient.sismember('users', user.username, function(err, res) {
    //                     assert.equal(res, false);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    // });
});
