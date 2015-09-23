var express = require('express');
var router = express.Router();
var invoiceController = require('./controllers/invoiceController');
var userController = require('./controllers/userController');
var authenticate = require('./config/authenticate');
var log = require("./config/logger");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// authenticate
router.post('/authenticate', authenticate.auth);

// create new user
router.post('/user', userController.post);

// route middleware to verify a token
router.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

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
