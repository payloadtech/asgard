var express = require('express');
var router = express.Router();
var invoiceController = require('./controllers/invoiceController');
var userController = require('./controllers/userController');
var ledgerController = require('./controllers/ledgerController');
var transactionController = require('./controllers/transactionController');
var authenticate = require('./lib/authenticate');
var log = require("./lib/logger");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var passport = require('passport');


// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('index.ejs');
});

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('login.ejs', {
    message: req.flash('loginMessage')
  });
});

// process the login form
// app.post('/login', do all our passport stuff here);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', {
    message: req.flash('signupMessage')
  });
});

// process the signup form
// app.post('/signup', do all our passport stuff here);

// =====================================
// PROFILE SECTION =====================
// =====================================

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
    user: req.user,
    message: req.flash('message')
  });
});

// KYC from
router.get('/kyc', isLoggedIn, function(req, res) {
  res.render('kyc.ejs', {
    user: req.user
  });
});

// qr code
router.get('/qr', isLoggedIn, function(req, res) {
  res.render('qr.ejs', {
    user: req.user,
    amount: req.flash('amount'),
    address: req.flash('address'),
    price: req.flash('price')
  });
});


// Sell Bitcoin from
router.get('/sell', isLoggedIn, transactionController.sell);

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// =====================================
// Transaction  ========================
// =====================================

router.post('/kyc', isLoggedIn, transactionController.kyc);

// make new invoice
router.post('/qr', isLoggedIn, invoiceController.post);

// create new invoice
router.get('/invoice', isLoggedIn, invoiceController.get);

// get ledgers
router.get('/ledger', isLoggedIn, ledgerController.get);

// get ledgers page
router.get('/ledgers', function(req, res) {
  res.render('ledger.ejs', {
    user: req.user
  });
});
// ===================================

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/signup', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

// get users
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

module.exports = router;
