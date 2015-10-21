// lib/passport.js

var bcrypt = require('bcryptjs');

// load all the things
var LocalStrategy = require('passport-local').Strategy;

// models
var models = require("../models");
var users = require("../models/User.js");

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (users, done) {
        done(null, users.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function (email, done) {
        models.User.find({ where: { email: email } }).then(function (found) {
            done(found);
        }).catch(function (error) {
            console.log("ops: " + error);
            // reply with error
            return done(error);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
   
    
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, done) { // callback with email and password
        
            var email = req.body.email;
            var password = req.body.password;

            console.log("EMAIL: " + email + " PASS: " + password);
        
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            models.User.find({ where: { email: email } }).then(function (found) {
                // if the user is found but the password is wrong
                if (found) {                   
                    // compare passwords
                    bcrypt.compare(password, found.password, function (err, result) {
                        if (err)
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        // else return result                        
                        return done(null, result);
                    });
                }               
                // if no user is found, return the message
                if (!found)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash              
                
            }).catch(function (error) {
                console.log("ops: " + error);
                // reply with error
                return done(error);
            });
        }));
}
        
        
              