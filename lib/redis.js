// load the modules
var redis = require('redis');
var url = require('url');

var config = require('../config');

// connect to redis
var redisURL = url.parse(config.redisUrl);
var client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);

// export connection
module.exports = client;
