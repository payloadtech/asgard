var express = require('express');
var router = express.Router();
var invoiceController = require('./controllers/invoiceController');
var userController = require('./controllers/userController');
var authenticate = require('./lib/authenticate');
var log = require("./lib/logger");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var passport = require('passport');

// authenticate
router.post('/authenticate', authenticate.auth);

// create new user
router.post('/user', userController.post);

router.get('/user', passport.authenticate('local-login', {
        successRedirect : '/user', // redirect to the secure profile section
        failureRedirect : '//payload.pk', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// redirect home page to API documentation
router.get('/', function (req, res, next) {
  res.redirect('//payload.pk/api');
});

// create new invoice
router.post('/invoice', invoiceController.post);
// get invoices
router.get('/invoice', invoiceController.get);

// get users
router.get('/user', userController.get);


module.exports = router;
