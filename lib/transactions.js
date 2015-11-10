var log = require("./logger");
var kue = require('kue');
var WebSocket = require('ws');
var ws = new WebSocket('wss://ws.chain.com/v2/notifications');
var models = require("../models");
var queue = require('./queue.js');


module.exports.trans = function () {

  queue.process('transactionHash', 500, function (job, done) {

    // create a object for blockchain transaction subs
    console.log("Processing Job : " + job.id);
    var btcAddress = job.data.btcAddress;
    // create a object for blockchain address subs
    var reqWs = {
      type: "address",
      address: btcAddress,
      block_chain: "bitcoin"
    };
    // log BTC address
    log.debug("BTC Address is : " + btcAddress);
    // subscribe to block chain address notifications
    ws.send(JSON.stringify(reqWs));
    ws.on('message', function (ev) {
      // log block chain notification
      var x = (JSON.parse(ev));
      if (x.payload.type === "address") {
        if (x.payload.address === btcAddress) {
          var hash = x.payload.transaction_hash;
          // log transaction hash
          log.debug("Transaction hash : " + x.payload.transaction_hash);
          // update in database
          models.Invoice.find({ where: { btcAddress: btcAddress } }).then(function (found) {
            if (found) {
              // update if found
              
              if (found.transactionId == "" || !found.transactionId || found.transactionId == null) {
                found.updateAttributes({ transactionId: hash, status: "pending" }).then(function () {

                  var reqInv = {
                    type: "transaction",
                    transaction_hash: hash,
                    block_chain: "bitcoin"
                  };
                  
                  // subscribe to block chain transaction notifications
                  ws.send(JSON.stringify(reqInv));
                  var receivedConf = 0, currentConf = 0, requiredConf = 0;

                  ws.on('message', function (ev) {

                    var y = (JSON.parse(ev));
                    if (y.payload.type === "transaction") {
                      // log received confirmations

                      log.info("Confirmation received : " + y.payload.transaction.confirmations);
                      receivedConf = y.payload.transaction.confirmations;
                      // find invoice current and required confirmations

                      models.Invoice.find({ where: { btcAddress: btcAddress } }).then(function (found) {
                        if (found) {
                          // if the record exists in the db
                          currentConf = found.confirmations;
                          requiredConf = found.confirmationSpeed;

                          log.info("Current inv conf : " + currentConf);
                          log.info("Required inv conf : " + requiredConf);


                          if (receivedConf >= requiredConf) { 
                            // update invoice status
                            found.updateAttributes({ status: "paid", confirmations: receivedConf }).then(function () {

                              // *** from invoice to user *** //    
                  
                              var myledger = {
                                'from': "invoice",
                                'to': found.userId, // user id
                                'refId': found.id, // invoice id
                                'currency': "BTC",
                                'amount': found.amount,
                                'rate': found.rate,
                              }

                              console.log("Ledger is : " + myledger);                                             
                  
                              // add to ledgers
                              models.Ledgers.create(myledger).then(function (ledger) {
                                log.info("Created ledger (from invoice to user): " + ledger.id);
                                
                                // *** from user to exchange *** // 
                   
                                myledger.from = found.userId; // user id
                                myledger.to = "exchange"; // user id
                                
                                console.log("Ledger is : " + myledger);  
                                  
                                // add to ledgers
                                models.Ledgers.create(myledger).then(function (ledger) {
                                  log.info("Created ledger (from user to exchange): " + ledger.id);
                                  
                                  // *** from exchange to user *** // 
                   
                                  myledger.from = "exchange";
                                  myledger.to = found.userId; // user id
                                  myledger.currency = "PKR";

                                  console.log("Ledger is : " + myledger);  

                                  // add to ledgers
                                  models.Ledgers.create(myledger).then(function (ledger) {
                                    log.info("Created ledger (from exchange to user): " + ledger.id);
                                    
                                    // update user balance
                                    models.User.find({ where: { id: found.userId } }).then(function (found) {
                                      if (found) {

                                        found.updateAttributes({ amount: found.price }).then(function () {
                                          
                                          // JOB completed
                                          done();

                                        }).catch(function (error) {
                                          console.log("ops: " + error);
                                        });

                                      }
                                    }).catch(function (error) {
                                      console.log("ops: " + error);
                                    });

                                  }).catch(function (error) {
                                    console.log("ops: " + error);
                                  });

                                }).catch(function (error) {
                                  console.log("ops: " + error);
                                });

                              }).catch(function (error) {
                                console.log("ops: " + error);
                              });
                            });
                          }
                          else {
                            // update invoice confirmations
                            found.updateAttributes({ confirmations: receivedConf }).catch(function (error) {
                              console.log("ops: " + error);
                            });
                          }
                        }
                      }).catch(function (error) {
                        log.info("Error : " + error);
                      });
                    }
                  });
                }).catch(function (error) {
                  console.log("ops: " + error);
                });
              }
            }
          }).catch(function (error) {
            console.log("ops: " + error);
          });
        }
      } else {
        {
          // log heartbeat
          log.debug(x.payload);
        }
      }
    });
  });
};
