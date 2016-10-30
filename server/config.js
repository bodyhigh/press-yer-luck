var env = require('./env');

var config = {
    PORT: getEnv('PORT') || 5000,
    NODE_ENV: getEnv('NODE_ENV') || 'development'
};

function getEnv(variable) {
    if (process.env[variable] === undefined) {
        throw new Error('You must create an environment variable for ' + variable);
    }

    return process.env[variable];
}

module.exports = config;
