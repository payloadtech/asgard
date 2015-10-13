var request = require('request');
var Coinbase = require('coinbase').Client;
var coinbaseParams = {
  'apiKey': process.env.COINBASE_API_KEY,
  'apiSecret': process.env.COINBASE_API_SECRET,
  'baseApiUri': process.env.COINBASE_API_URI
};
var coinbase = new Coinbase(coinbaseParams);

var Account = require('coinbase').model.Account;
var btcAccount = new Account(coinbase, {
  'id': process.env.COINBASE_API_WALLET
});
module.exports = btcAccount;
