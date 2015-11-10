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
		var id = req.user.id;
		models.User.find({ where: { id: id } }).then(function (found) {
			if (found.verified === 'verified') {
				res.render('sell.ejs', { user: req.user })
			}
			else {
				req.flash('message', 'Oops! Your account status is ' + found.verified)
				res.redirect("/profile");
			}
		});
	},
	kyc: function (req, res) {
		var id = req.user.id;
		models.User.find({ where: { id: id } }).then(function (found) {
			if (found.verified === 'unverified') {

				var dateob = req.body.dropdownMonth + "/" + req.body.dropdownDay + "/" + req.body.dropdownYear;
				var ntnNo, landLine;
				if (!req.body.ntn || req.body.ntn === "")
					ntnNo = req.body.cnic;
				if (!req.body.ntn || req.body.ntn === "")
					landLine = req.body.cellNo;
				found.updateAttributes({
					name: req.body.name,
					dob: dateob,
					cnic: req.body.cnic,
					fatherName: req.body.fatherName,
					occupation: req.body.occupation,
					ntn: ntnNo,
					cellNo: req.body.cellNo,
					landLineNo: landLine,
					permanentAdd: req.body.permanentAdd,
					mailAdd: req.body.mailAdd,
					bankAccNo: req.body.bankAccNo,
					bankName: req.body.bankName,
					verified: "pending"
				}).then(function () {
					
					// return to user profile
					req.flash('message', 'Thanks! Wait until your account status is verified. :)')
					res.redirect("/profile");

				}).catch(function (error) {
					log.debug("Error : " + error);
				});
			}
			else {
								
				// return to user profile
				req.flash('message', 'Oops! Your account status is ' + found.verified)
				res.redirect("/profile");
			}
		}).catch(function (error) {
			log.debug("Error : " + error);
		});

	}
};
