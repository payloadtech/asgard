var log = require('../lib/logger');
var fs = require("fs");
var path = require("path");

var controllers = {};

// import all the controllers in `controllers/`
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    var controller = require(path.join(__dirname, file));
    controllers[file] = controller;
  });

module.exports = controllers;
