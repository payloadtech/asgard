var log = require("../config/logger");
var models = require("../models");
module.exports = {
	post: function (req, res) {
		// if no price is sent
		if (!req.body.fName || !req.body.lName || !req.body.email || !req.body.password ) {
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
	}
}
	