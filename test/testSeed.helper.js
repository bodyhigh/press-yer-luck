var repo = require('./../server/data/repo');
var redisClient = require('./../server/database/redis.js');

var createUserWithScores = function(seedUser, scores, redisClient, done, cb) {
    if (scores === null || !Array.isArray(scores)) {
        // Use some default scores if values are not supplied
        scores = [20, 0, 3];
    }

    return repo.user.setUser(seedUser, 7200, redisClient)
        .then(function() {
            repo.user.setUserScore(seedUser.username, scores[0], redisClient).then(function() {
                repo.user.setUserScore(seedUser.username, scores[1], redisClient).then(function() {
                    repo.user.setUserScore(seedUser.username, scores[2], redisClient).then(function() {
                        cb();
                    }, done);
                }, done);
            }, done);
        });
};

var createThreeUsersWithScores = function(seedUsers, redisClient, done, cb) {
    if (!Array.isArray(seedUsers) || seedUsers.length !== 3) {
        throw new Error('seedUser must be an array[3]');
    }

    var user3 = createUserWithScores(seedUsers[0], null, redisClient, done, cb);
    var user2 = createUserWithScores(seedUsers[1], [0, 0, 1], redisClient, done, user3);
    var user1 = createUserWithScores(seedUsers[2], [11, 22, 33], redisClient, done, user2);
};

module.exports = {
    createUserWithScores: createUserWithScores,
    createThreeUsersWithScores: createThreeUsersWithScores
};
