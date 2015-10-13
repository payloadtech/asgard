var market = require('./lib/market.js');
var trans = require('./lib/transactions.js');
// push continuous rate updates to redis
market.contRate();
// start transactions confirmation job
trans.trans();
