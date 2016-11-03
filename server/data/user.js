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

// This function will update the user Hash's total points and turns, also will update the leaderboards
var setUserScore = function(username, score, redisClient) {
    return q.promise(function(resolve, reject, notify) {
        var query = getUser(username, redisClient);

        query.then(function(user) {
            if (user === null) {
                // something is not good
                reject('Could not locate a Hash for: ' + username);
            } else {
                // user found
                score = parseInt(score);
                user.totalPoints += score;
                user.totalTurns++;
                var newAverage = parseFloat(user.totalPoints) / parseFloat(user.totalTurns);

                redisClient.multi()
                    .hincrby(user.username, 'totalPoints', score)
                    .hincrby(user.username, 'totalTurns', 1)
                    .zincrby('leaderboard:HighestTotal', score, user.username)
                    .zadd('leaderboard:HighestAverage', newAverage, user.username)
                    .exec(function(err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({username: username, totalPoints: parseInt(res.totalPoints), totalTurns: parseInt(res.totalTurns)});
                        }
                    });
            }
        }, function(err) {
            reject(err);
        });
    });
};

var user = {
    removeUser: removeUser,
    setUser: setUser,
    getUser: getUser,
    setUserScore: setUserScore
};

module.exports = user;
