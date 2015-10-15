var log = require('../lib/logger');

var config = {
  coinbaseApiKey: process.env.COINBASE_API_KEY,
  coinbaseApiSec: process.env.COINBASE_API_SECRET,
  coinbaseApiUri: process.env.COINBASE_API_URI,
  coinbaseApiWallet: process.env.COINBASE_API_WALLET,
  dbUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  secret: process.env.SECRET,
  mailerUser: process.env.MG_USER,
  mailerPass: process.env.MG_PASS,
  authSecret: process.env.AUTH_SECRET,
  mysqlUrl: process.env.MYSQL_URL
};

try {
  var overrides = require('./configOverrides.js');
  Object.keys(overrides).forEach(function(key) {
    log.debug("found override for " + key);
    config[key] = overrides[key];
  });

} catch (e) {
  // if no override file is found
  log.debug("no overrides found, reverting to env vars");

}

module.exports = config;
