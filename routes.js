var express = require('express');
var router = express.Router();
var invoiceController = require('./controllers/invoiceController');
var log = require("./config/logger");

// redirect home page to API documentation
router.get('/', function(req, res, next) {
  res.redirect('//payload.pk/api');
});

// invoice
router.post('/invoice', invoiceController.post);

module.exports = router;
