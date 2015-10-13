var config = require('../config');
var log = require("./logger");
var models = require("../models");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports.auth = function (req, res) {
  // if no price is sent
		if (!req.body.email || !req.body.password) {
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


  var email = req.body.email;
  var password = req.body.password;

  console.log(email);

  // find user
  models.User.find({ where: { email: email } }).then(function (found) {
    if (!found) {
      return res.json({
        success: false,
        message: "Authentication failed. User not found."
      });
    }
    else if (found) {


      bcrypt.compare(password, found.password, function (err, result) {
        if (result) {


      console.log('in comapre');

          // if user is found and password is right
          // create a token
          var token = jwt.sign(found, config.authSecret, {
            expiresInMinutes: 1440 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });

        }
        else {
          return res.json({
            success: false,
            message: "Authentication failed. Wrong password."
          });
        }
      });

    }

  }).catch(function (error) {
    console.log("ops: " + error);
    // reply with a 500 error
    res.status(500);
    return res.json({
						success: false,
						message: "Internal server error"
    });
  });


};
