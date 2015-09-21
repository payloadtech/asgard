var express = require('express');
var router = express.Router();
var invoiceController = require('./controllers/invoiceController');
var userController = require('./controllers/userController');
var log = require("./config/logger");

// redirect home page to API documentation
router.get('/', function(req, res, next) {
  res.redirect('//payload.pk/api');
});

// create new invoice
router.post('/invoice', invoiceController.post);
// get invoices
router.get('/invoice', invoiceController.get );

// create new user
router.post('/user', userController.post);
// get users
router.get('/user', userController.get );

module.exports = router;
