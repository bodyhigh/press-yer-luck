var q = require('q');

var getNextSessionId = function(redisClient) {
    return q.promise(function(reject, resolve, notify) {
        redisClient.incr('nextSessionId', function(err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};

module.exports = {
    getNextSessionId: getNextSessionId
};
