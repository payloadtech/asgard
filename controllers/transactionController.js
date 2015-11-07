var wallet = require("../lib/wallet");
var redis = require("../lib/redis");
var log = require("../lib/logger");
var WebSocket = require('ws');
var ws = new WebSocket('wss://ws.chain.com/v2/notifications');
var models = require("../models");
var market = require('../lib/market.js');
var queue = require('../lib/queue.js');

module.exports = {
	sell: function (req, res) {

	},
	kyc: function (req, res) {

	}
};
