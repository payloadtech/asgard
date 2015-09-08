var log = require("./logger");
var kue = require('kue');
var WebSocket = require('ws');
var ws = new WebSocket('wss://ws.chain.com/v2/notifications');
var queue = kue.createQueue();
var Invoice = require("../models/Invoice");

module.exports.trans = function () {
  queue.process('transactionHash', function (job, done) {
    // create a object for blockchain transaction subs
    var btcAddress = job.btcAddress;
    
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

  queue.process('confirmation', function (job, done) {
    // create a object for blockchain transaction subs
    var hash = job.transHash;
    var btcAddress = job.btcAddress;
    var reqInv = {
      type: "transaction",
      transaction_hash: hash,
      block_chain: "bitcoin"
    };
    // subscribe to block chain transaction notifications
    ws.send(JSON.stringify(reqInv));
    var receivedConf = 0, invoiceConf = 0, requiredConf = 0;
    ws.on('message', function (ev) {

      Invoice.find({ where: { btcAddress: btcAddress } }).on('success', function (found) {
        if (found) { 
          // if the record exists in the db
          found.updateAttributes({ transactionId: hash }).success(function () { });
        }
      });

      var y = (JSON.parse(ev));
      if (y.payload.type === "transaction") {
        // log received confirmations
        log.silly("Confirmation received : " + y.payload.transaction.confirmations);
        receivedConf = y.payload.transaction.confirmations;
        // find invoice previous and required confirmations
        
        Invoice.find({ where: { btcAddress: btcAddress } }).on('success', function (found) {
          if (found) {
            // if the record exists in the db
            log.silly("Invoice pervious conf : " + found.confirmations);
            invoiceConf = found.confirmations;
            requiredConf = found.confirmationSpeed;

            log.silly("Current inv conf : " + invoiceConf);
            log.silly("Required inv conf : " + requiredConf);

            if (receivedConf > invoiceConf) {
              // update invoice confirmations                     
              found.updateAttributes({ confirmations: receivedConf }).success(function () { });
            }
            else if (invoiceConf === requiredConf) {
              // update invoice status      
              found.updateAttributes({ status: "paid" }).success(function () {
                done();
              });
            }
          }
        });
      }
    });
  });
}
