var env = process.env.NODE_ENV;

var redis = require('redis');
var helper = require('./redisHelper');

if (process.env.REDISTOGO_URL) {
    var rtg   = require('url').parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]);
} else {
    var client = redis.createClient();
}

if (env === 'test') {
    client.select(15);
}

module.exports = client;
