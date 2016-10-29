var env = require('./env');

var config = {
    PORT: getEnv('PORT'),
    NODE_ENV: getEnv('NODE_ENV')
};

function getEnv(variable) {
    if (process.env[variable] === undefined) {
        throw new Error('You must create an environment variable for ' + variable);
    }

    return process.env[variable];
}

module.exports = config;
