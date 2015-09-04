// load the modules
var redis = require('redis');
var url = require('url');

// notify if REDIS_URL is unset
if (!process.env.REDIS_URL) console.error('Please set the REDIS_URL variable');

// connect to redis
var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);

// export connection
module.exports.redis = client;