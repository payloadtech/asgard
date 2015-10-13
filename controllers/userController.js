var log = require("../lib/logger");
var models = require("../models");
var bcrypt = require('bcryptjs');

module.exports = {
	post: function (req, res) {
		// if no price is sent
		if (!req.body.fName || !req.body.lName || !req.body.email || !req.body.password) {
			// reply with a 400 error saying that required parameter is missing
			res.status(400);
			res.json({
				success: false,
				message: "required parameter is missing"
			});
			// log the failure and drop out of the function
			return log.info('User unsuccessful', {
				missing: "required parameter",
				path: req.path,
				payload: req.body
			});
		}

		var user = req.body;

		console.log('USER PASSWORD : ' + user.password);
		bcrypt.genSalt(10, function (err, salt) {

			console.log('SALT : ' + salt);
			bcrypt.hash(user.password, salt, function (err, hash) {
				// Store hashed password in DB.
				user.password = hash;
				console.log('USER PASSWORD AFTER : ' + user.password);
				models.User.create(user).then(function (user) {
					log.debug("Created user: " + user.id);
					// respond with the amount
					res.json(user);
				}).catch(function (error) {
					console.log("ops: " + error);
					// reply with a 500 error
					res.status(500);
					return res.json({
						success: false,
						message: "Internal server error",
						error: error.message
					});
				});
			});
		});

	},
	get: function (req, res) {
		models.User.findAll().then(function (found) {
			var result = JSON.parse(JSON.stringify(found));
			res.json(result);
		});
	}
};
