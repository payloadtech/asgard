// test libraries
var mocha = require('mocha');
var should = require('should');
var request = require('require');

// localhost
var url = "http://localhost:3000/";

describe('Invoice API tests', function(){
  // level 1
  it('Return "invoiceId", "amount", "wallet", "currency", and ' +
  '"rate" given "price", and "callback"', function(done){
    var bill = {
      price: 500,
    };
    request.post(url + 'invoice', bill, function(err, head, body) {
      body = JSON.parse(body);
      // requirements
      should.not.exist(err);
      head.status.should.be("200");
      should.exist(body.invoiceId);
      should.exist(body.amount);
      should.exist(body.address);
      should.exist(body.currency);
      should.exist(body.rate);
      done();
    });
  });

  // level 2
  it('Return "amount", "currency" and "rate" given "price"', function(){

  });
});
