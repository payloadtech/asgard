// test libraries
var mocha = require('mocha');
var should = require('should');

// stuff to test
var log = require('../config/logger.js');
var mailer = require('../config/mailer.js');
var market = require('../config/market.js');
var redis = require('../config/redis.js');
var sequelize = require('../config/sequelize.js');
var transactions = require('../config/transactions');
var wallet = require('../config/wallet');

describe('Configured Objects', function() {

  // the logger
  it('Should log everything to console', function(done) {
    try {
      log.emerg('logging a emergency');
      log.alert('logging a alert');
      log.crit('logging a critical');
      log.error('logging a error');
      log.warning('logging a warning');
      log.notice('logging a notice');
      log.info('logging information');
      log.debug('logging a debug message');
    } catch (err) {
      // requirement
      should.not.exist(err);
    }
    done();
  });

  // the mailer
  it('Should send an email', function(done) {
    mailer.sendMail({
      from: 'Payload Cupcake <cupcake@letter.payload.pk>',
      replyTo: 'support@payload.pk',
      to: 'aminshahgilani+asgardtest@gmail.com',
      subject: 'testing asgard',
      text: 'Please ignore this email, sent as part of a test'
    }, function(err, info) {
      // requirements
      should.not.exist(err);
      info.response.should.equal('250 Great success');
    });
  });

  // redis
  it('Should set and get data', function(done){
    var data = "This is unique data";
    redis.set("testData", data);
    redis.get("testData", function(err, reply){
      should.not.exist(err);
      reply.should.equal(data);
    });
  });

});
