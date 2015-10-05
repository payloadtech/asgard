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
    var profitMultiplier = 98 / 100; // deducts the profit for Payload services
    var usd2pkr = 104.5;


    var volBTC = 0; // the volume of bitcoins
    var valBTC = 0; // the value of the bitcoins
    var wBTC; // the weighted price per bitcoin
    var netPriceUSD;
    var netPricePKR;

    for (i = 0; i < data.asks.length; i++) {
      volBTC += parseFloat(data.asks[i][1]);
      valBTC += parseFloat(data.asks[i][0]) * parseFloat(data.asks[i][1]);
    }

    // volume weighted price per bitcoin
    wBTC = valBTC / volBTC;

    // net price per bitcoin
    netPriceUSD = wBTC * netTradeMultiplier * netWithdrawalMultiplier * profitMultiplier;
    netPricePKR = usd2pkr * netPriceUSD;

    log.debug("cumulative volume of bitcoin", volBTC);
    log.debug("value of bitcoin in USD", valBTC);
    log.debug("value per bitcoin", wBTC);
    log.debug("price per bitcoin USD", netPriceUSD);
    log.debug("price per bitcoin PKR", netPricePKR);

    redis.set("rateUSD", netPriceUSD);
    redis.set("ratePKR", netPricePKR);

  });
};
