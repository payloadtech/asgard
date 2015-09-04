/* global sails */
var Pusher = require('pusher-client');
var redis = sails.config.redis;
var log = require("../lib/logger");

// connect to Bitstamp's pusher
var pusherBitstamp = new Pusher('de504dc5763aeef9ff52');

// subscribe to the `order_book` channel
var orderBookChannel = pusherBitstamp.subscribe('order_book');

// export the bind-ed the channel
module.exports.contRate = function() {
  orderBookChannel.bind('data', function(data) {

    var volBTC = 0; // the volume of bitcoins
    var valBTC = 0; // the value of the bitcoins
    var wBTC = 0; // the weighted price per bitcoin

    for (i = 0; i < data.asks.length; i++) {
      volBTC += parseFloat(data.asks[i][1]);
      valBTC += parseFloat(data.asks[i][0]) * parseFloat(data.asks[i][1]);
    }

    wBTC = valBTC / volBTC;

    log.debug("cumulative volume of bitcoin", volBTC);
    log.debug("value of bitcoin in USD", valBTC);
    log.debug("value per bitcoin", wBTC);
    redis.set("rateUSD", wBTC);

  });
};
