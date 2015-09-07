var wallet = require("../config/wallet");
var redis = require("../config/redis");
var log = require("../config/logger");
var kue = require('kue');
var WebSocket = require('ws');
var ws = new WebSocket('wss://ws.chain.com/v2/notifications');
var queue = kue.createQueue();

module.exports = {
  post: function (req, res) {
    // if no price is sent
    if (!req.body.price) {
      // reply with a 400 error saying that 'price' is required
      res.status(400);
      res.json({
        success: false,
        message: "'price' is required."
      });
      // log the failure and drop out of the function
      return log.info('Invoice unsuccessful', {
        missing: "price",
        path: req.path,
        payload: req.body
      });
    }
    // if no currency is sent, assume it is PKR
    if (!req.body.currency) {
      req.body.currency = "USD";
    }
    var rate;
    // assign rate the value of the currency called
    switch (req.body.currency) {
      case 'USD':
        rate = 'rateUSD';
        break;
      case 'PKR':
        rate = 'ratePKR';
        break;
      default:
        rate = 'ratePKR';
    }
    // get the rate from memory
    redis.get(rate, function (err, rateCurrent) {
      if (err) log.error("rateUSD fetch unsuccessful", err);
      var amount = parseFloat(req.body.price) / rateCurrent;
      // create an invoice object
      wallet.createAddress({
        "callback_url": '',
        "label": "first blood"
      }, function (err, newBtcAddress) {
        if (err) log.error(err);
        createInvoice(newBtcAddress);
      });
      function createInvoice(newBtcAddress) {
        var btcAddress = newBtcAddress.address;
        var invoice = {
          "price": parseFloat(req.body.price),
          "currency": req.body.currency,
          "rate": rateCurrent,
          "amount": amount,
          "btcAddress": btcAddress
        };
        Invoice.create(invoice).exec(function (err, invoice) {
          if (err) {
            // log the error
            log.error(err);
            // reply with a 500 error
            res.status(500);
            return res.json({
              success: false,
              message: "Internal server error"
            });
          }
          log.debug("Created invoice: " + invoice.id);
          // respond with the amount
          res.json({
            "invoiceId": invoice.id,
            "amount": invoice.amount,
            "address": btcAddress
          }); 
          // create a object for blockchain address subs   
          var reqWs = {
            type: "address",
            address: btcAddress,
            block_chain: "bitcoin"
          };
          // log BTC address
          log.silly("BTC Address is : " + btcAddress);
          // subscribe to block chain address notifications
          ws.send(JSON.stringify(reqWs));
          ws.on('message', function (ev) {
            // log block chain notification
            var x = (JSON.parse(ev));
            if (x.payload.type === "address") {
              if (x.payload.address === btcAddress) {
                var hash = x.payload.transaction_hash;
                // log transaction hash
                log.silly("Transaction hash : " + x.payload.transaction_hash);
                // create confirmation job in kue
                var job = queue.create('confirmation', {
                  transHash: hash,
                  btcAddress: btcAddress
                }).priority('high').save(function (err) {
                  if (err) log.error("Kue job error : " + err);
                  else log.silly("Job id : " + job.id)
                });
              }
            } else {
              {
                // log heartbeat
                log.silly(x.payload);
              }
            }
          });
        });
      }
    });
  }
};