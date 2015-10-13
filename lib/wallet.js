var config = require('../config');
var request = require('request');
var Coinbase = require('coinbase').Client;
var coinbaseParams = {
  'apiKey': config.coinbaseApiKey,
  'apiSecret': config.coinbaseApiSec,
  'baseApiUri': config.coinbaseApiUri
};
var coinbase = new Coinbase(coinbaseParams);

var Account = require('coinbase').model.Account;
var btcAccount = new Account(coinbase, {
  'id': config.coinbaseApiWallet
});
module.exports = btcAccount;
