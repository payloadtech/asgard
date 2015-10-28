var log = require("../lib/logger");
var models = require("../models");

module.exports = {
  get: function (req, res) {
    models.Ledgers.findAll().then(function (found) {
      var result = JSON.parse(JSON.stringify(found));
      res.json(result);
    });
  }
};
