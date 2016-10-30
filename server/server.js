var https = require('http');
var express = require('express');
var config = require('./config');
var redisClient = require('./database/redis');
var socketio = require('./data/socket');
var path = require('path');

var app = express();
var root = path.normalize(__dirname + '/..');

app.set('clientPath', path.join(root, 'client'));
app.set('port', config.PORT);
app.set('node_env', config.NODE_ENV);

app.use(express.static(app.get('clientPath')));

// Routes
app.get('/', function(req, res) {
    res.status(200).send('<h1>Hello World</h1>');
});

var server = app.listen(app.get('port'), function() {
    console.log('Express server is listening on port', server.address().port);
});

//start up socket.io
socketio(server,redisClient);
