/* global sails */
var Pusher = require('pusher-client');
var redis = require("./redis");
var log = require("./logger");

// connect to Bitstamp's pusher
var pusherBitstamp = new Pusher('de504dc5763aeef9ff52');

// subscribe to the `order_book` channel
var orderBookChannel = pusherBitstamp.subscribe('order_book');

// export the bind-ed the channel
module.exports.contRate = function () {
  orderBookChannel.bind('data', function (data) {

    // Bitstamp's trading fees
    var tradeFee = 25 / 10000; // deducts the .25% trade fee
    var netWithdrawalMultiplier = (1000 - 80) / 1000; // deduct $30 per $1000
    var netDepositMultiplier = (1000 + 100) / 1000; // add $100 per $1000
    var profitPercentage = 2 / 100; // deducts the profit for Payload services
    var usd2pkr = 105;

    // BEGIN BID PRICE CALCULATION
    var bidVolBTC = 0; // the volume of bitcoins
    var bidValBTC = 0; // the value of the bitcoins
    var bidWBTC; // the weighted price per bitcoin
    var bidNetPriceUSD;
    var bidNetPricePKR;

    for (i = 0; i < data.bids.length; i++) {
      bidVolBTC += parseFloat(data.bids[i][1]);
      bidValBTC += parseFloat(data.bids[i][0]) * parseFloat(data.bids[i][1]);
    }

    // volume weighted price per bitcoin
    bidWBTC = bidValBTC / bidVolBTC;

    // net bid price per bitcoin in USD
    bidNetPriceUSD =
    bidWBTC *
    (1 - tradeFee) *
    netWithdrawalMultiplier *
    (1 - profitPercentage);

    // net bid price per bitcoin in PKR
    bidNetPricePKR = usd2pkr * bidNetPriceUSD;

    log.debug("BID: cumulative volume of bitcoin", bidVolBTC);
    log.debug("BID: value of bitcoin in USD", bidValBTC);
    log.debug("BID: value per bitcoin", bidWBTC);
    log.info("BID: price per bitcoin USD", bidNetPriceUSD);
    log.info("BID: price per bitcoin PKR", bidNetPricePKR);

    redis.set("bidRateUSD", bidNetPriceUSD);
    redis.set("bidRatePKR", bidNetPricePKR);
    // END BID PRICE CALCULATION

    // BEGIN ASK PRICE CALCULATION
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
    (1 + tradeFee) *
    netDepositMultiplier *
    (1 + profitPercentage);

    // net ask price per bitcoin in PKR
    askNetPricePKR = usd2pkr * askNetPriceUSD;

    log.debug("ASK: cumulative volume of bitcoin", askVolBTC);
    log.debug("ASK: value of bitcoin in USD", askValBTC);
    log.debug("ASK: value per bitcoin", askWBTC);
    log.info("ASK: price per bitcoin USD", askNetPriceUSD);
    log.info("ASK: price per bitcoin PKR", askNetPricePKR);

    redis.set("askRateUSD", askNetPriceUSD);
    redis.set("askRatePKR", askNetPricePKR);
    // END ASK PRICE CALCULATION

  });
};
