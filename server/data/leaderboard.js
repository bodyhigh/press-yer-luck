var q = require('q');
var _ = require('underscore');
var redisHelper = require('./../database/redisHelper.js');

var getTotalLeaderboard = function(redisClient) {
    return q.promise(function(resolve, reject, notify) {
        redisClient.zrevrange('leaderboard:HighestTotal', 0, -1, 'withscores', function(err, res) {
            if (err) {
                reject(err);
            } else if (res === null) {
                resolve(null);
            } else {
                resolve(redisHelper.transformZsetResults(res, false));
            }
        });
    });
};

var getAverageLeaderboard = function(redisClient) {
    return q.promise(function(resolve, reject, notify) {
        redisClient.zrevrange('leaderboard:HighestAverage', 0, -1, 'withscores', function(err, res) {
            if (err) {
                reject(err);
            } else if (res === null) {
                resolve(null);
            } else {
                resolve(redisHelper.transformZsetResults(res, true));
            }
        });
    });
};

var leaderboard = {
    getTotalLeaderboard: getTotalLeaderboard,
    getAverageLeaderboard: getAverageLeaderboard
};

module.exports = leaderboard;
