var q = require('q');

var removeUser = function(username, redisClient) {
    return q.promise(function(resolve, reject, notify) {
        redisClient.srem('users', username, function(err) {
            if (err) {
                reject();
            }
            resolve();
        });
    });
};

var setUser = function(user, expire, redisClient) {
    return q.promise(function (resolve, reject, notify) {
        redisClient.multi()
            .hmset(user.username, 'totalPoints', user.totalPoints)
            .hincrby(user.username, 'totalTurns', 1)
            .expire(user.username, expire)
            .sadd('users', user.username)
            .expire('users', expire)
            .exec(function(err) {
                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
    });
};

var user = {
    removeUser: removeUser,
    setUser: setUser
};

module.exports = user;
