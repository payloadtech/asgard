var market = require('./config/market.js');
var trans = require('./config/transactions.js');
// push continuous rate updates to redis
market.contRate();
// start transactions confirmation job
trans.trans();