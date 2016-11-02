var q = require('q');

var removeUser = function(user, redisClient) {
    return q.promise(function(resolve, reject, notify) {
        redisClient.multi()
            .del(user.username)
            .srem('users', user.username)
            .exec(function(err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
    });
};

var setUser = function(user, expire, redisClient) {
    return q.promise(function (resolve, reject, notify) {
        redisClient.multi()
            .hmset(user.username, 'totalPoints', '0', 'totalTurns', '0')
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

var getUser = function(username, redisClient) {
    return q.promise(function(resolve, reject, notify) {
        redisClient.hgetall(username, function(err, res) {
            if (err === null) {
                if (res === null) {
                    resolve(null);
                } else {
                    resolve({username: username, totalPoints: parseInt(res.totalPoints), totalTurns: parseInt(res.totalTurns)});
                }
            } else {
                reject(err);
            }
        });
    });
};

var user = {
    removeUser: removeUser,
    setUser: setUser,
    getUser: getUser
};

module.exports = user;
