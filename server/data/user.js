var redisClient = require('./../database/redis.js');
// console.log('In user.js');

var getUser = function() {
    // console.log('executing getuser()');
    var user = undefined;

    if (user === undefined) {
        throw new Error('user is null');
    }

    return user;
}

var setUser = function() {
    console.log('executing setUser()');
}

var user = {
    getUser: getUser,
    setUser: setUser
};

module.exports = user;
