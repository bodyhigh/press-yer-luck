var redisClient = require('./../server/database/redis.js');

var createUser = function() {
    return 'Hello Helper';
};

module.exports = {
    createUser: createUser
};
