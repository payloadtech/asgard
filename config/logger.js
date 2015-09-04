/*
////////////////////////////////////////////////////
//                   Logger                       //
////////////////////////////////////////////////////

Example:

log.debug("recieved request", req)
// => this will log the entire request

Transports determine where the logs will be sent

Selecting a level will mean the transport will ignore logs below that level
*/

var winston = require('winston');
winston.emitErrs = true;

var logger = new(winston.Logger)({
  levels: {
    emerg: 7,
    alert: 6,
    crit: 5,
    error: 4,
    warning: 3,
    notice: 2,
    info: 1,
    debug: 0,
  },
  colors: {
    emerg: 'red',
    alert: 'yellow',
    crit: 'red',
    error: 'red',
    warning: 'red',
    notice: 'yellow',
    info: 'green',
    debug: 'blue',
  },
  transports: [
    new(winston.transports.Console)({
      colorize: true,
      handleExceptions: true,
      json: false,
      level: "debug"
    })
  ]
});

// if in production mode, don't log "debug" to console
if (process.env.NODE_ENV === "production") {
  logger.transports[0].level = "info";
}

module.exports = logger;
