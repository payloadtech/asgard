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
  this.routerHandler = function(req, res) {
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

    self.createBill(bill, function(err, savedBill) {
      res.json({
        'success': true,
        'bill': savedBill
      });
    });

  };
};


module.exports = controller;
