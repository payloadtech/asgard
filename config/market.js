/* global sails */
var Pusher = require('pusher-client');
var redis = require("./redis");
var log = require("./logger");

// connect to Bitstamp's pusher
var pusherBitstamp = new Pusher('de504dc5763aeef9ff52');

// subscribe to the `order_book` channel
var orderBookChannel = pusherBitstamp.subscribe('order_book');

// export the bind-ed the channel
module.exports.contRate = function() {
  orderBookChannel.bind('data', function(data) {

    // Bitstamp's trading fees
    var netTradeMultiplier = 9975 / 10000; // deducts the .25% trade fee
    var netWithdrawalMultiplier = 97 / 100; // deducts the 30 withdrawal fee
    var profitPercentage = 2 / 100; // deducts the profit for Payload services
    var usd2pkr = 104.5;


    var askVolBTC = 0; // the volume of bitcoins
    var askValBTC = 0; // the value of the bitcoins
    var askWBTC; // the weighted price per bitcoin
    var askNetPriceUSD;
    var askNetPricePKR;

    for (i = 0; i < data.asks.length; i++) {
      askVolBTC += parseFloat(data.asks[i][1]);
      askValBTC += parseFloat(data.asks[i][0]) * parseFloat(data.asks[i][1]);
    }

    // volume weighted price per bitcoin
    askWBTC = askValBTC / askVolBTC;

    // net ask price per bitcoin in USD
    askNetPriceUSD =
      askWBTC *
      netTradeMultiplier *
      netWithdrawalMultiplier *
      (1 - profitPercentage);

    // net ask price per bitcoin in PKR  
    askNetPricePKR = usd2pkr * askNetPriceUSD;

    log.debug("ASK: cumulative volume of bitcoin", askVolBTC);
    log.debug("ASK: value of bitcoin in USD", askValBTC);
    log.debug("ASK: value per bitcoin", askWBTC);
    log.debug("ASK: price per bitcoin USD", askNetPriceUSD);
    log.debug("ASK: price per bitcoin PKR", askNetPricePKR);

    redis.set("rateUSD", askNetPriceUSD);
    redis.set("ratePKR", askNetPricePKR);

  });
};
