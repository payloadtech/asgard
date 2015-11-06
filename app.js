/* global process */
var models = require("./models");
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes.js');
var debug = require('debug')('asgard:server');
var http = require('http');
var pg = require('pg');
var config = require('./config');

var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var cookieParser = require('cookie-parser');

var app = express();

// configure morgan
app.use(logger('dev'));

// configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs'); // set up ejs for templating

require('./lib/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users

// required for passport
app.use(session({ secret: config.sessionSecret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// set the routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server;

// Sync models

models.sequelize.sync().then(function () {
  
  // Create HTTP server, Listen on provided port, on all network interfaces.
    
  server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
    server.on('error', onError);
    server.on('listening', onListening);
  });

}).error(function (error) {
  console.log("ERROR IN CONN : " + error)
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
