var model = require('../models');
var _ = require('lodash');

var controller = function() {
  var self = this;

  // create Invoice
  this.createBill = function(bill, callback) {
    model.Bill.create(bill)
      .then(callback(null, result)
        .catch(callback(err)));
  };

  // route handler
  this.postHandler = function(req, res) {
    bill = _.pick(req.body, [
      'merchantBillId',
      'currency',
      'name',
      'address1',
      'address2',
      'city',
      'state',
      'zip',
      'country',
      'email',
      'phone',
      'dueDate',
      'expireDate',
      'items'
    ]);

    bill.owner = req.user.id; // the creator of the bill

    // create the invoice
    self.createBill(bill, function(err, savedBill) {
      res.json({
        'success': true,
        'bill': savedBill
      });
    });

  // payBill
  this.paymentHandler = function (req, res) {
    // Check if the bill is due, and has not expired yet
    // #TODO:0 check if the bill has an existing unexpired invoice
    // #TODO:10 if not, generate a new invoice
    // #TODO:20 redirect to invoice page
  };

  };
};


module.exports = controller;
