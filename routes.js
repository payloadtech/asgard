var express = require('express');
var router = express.Router();
var controller = require('./controllers/controllers');

// redirect home page to API documentation
router.get('/', function(req, res, next) {
  res.redirect('//payload.pk/api');
});

// invoice
router.post('/invoice', controllers.invoice.post);

module.exports = router;
