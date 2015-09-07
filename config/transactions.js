var log = sails.log;
var kue = require('kue');
var WebSocket = require('ws');
var ws = new WebSocket('wss://ws.chain.com/v2/notifications');
var queue = kue.createQueue();

module.exports.trans = function () {
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
      Invoice.update({ btcAddress: btcAddress }, { transactionId: hash }).exec(function afterwards(err, updated) {
        if (err) {
          // handle error here- e.g. `res.serverError(err);`
          log.error("Invoice update error : " + err)
          return;
        }
      });
      var y = (JSON.parse(ev));
      if (y.payload.type === "transaction") {
        // log received confirmations
        log.silly("Confirmation received : " + y.payload.transaction.confirmations);
        receivedConf = y.payload.transaction.confirmations;
        // find invoice previous and required confirmations
        Invoice.findOne({ btcAddress: btcAddress }).exec(function findOneCB(err, found) {
          if (err) {
            // handle error here- e.g. `res.serverError(err);`
            log.error("Invoice not found : " + err);
          }
          log.silly("Invoice pervious conf : " + found.confirmations);
          invoiceConf = found.confirmations;
          requiredConf = found.confirmationSpeed;

          log.silly("Current inv conf : " + invoiceConf);
          log.silly("Required inv conf : " + requiredConf);

          if (receivedConf > invoiceConf) {
            // update invoice confirmations
            Invoice.update({ btcAddress: btcAddress }, { confirmations: receivedConf }).exec(function afterwards(err, updated) {
              if (err) {
                // handle error here- e.g. `res.serverError(err);`
                log.error(err);
                return;
              }
              log.silly('Updated invoice confirmations : ' + updated[0].confirmations);
            });
          } else if (invoiceConf === requiredConf) {
            // update invoice status
            Invoice.update({ btcAddress: btcAddress }, { status: "paid" }).exec(function afterwards(err, updated) {
              if (err) {
                // handle error here- e.g. `res.serverError(err);`
                log.error(err);
                return;
              }
              log.silly("Invoice id " + updated[0].id + " status paid");
            });
            done();
          }
        });
      }
    });
  });
}
