// lib/passport.js

var bcrypt = require('bcryptjs');
var log = require("../lib/logger");

// load all the things
var LocalStrategy = require('passport-local').Strategy;

// models
var models = require("../models");

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function (email, done) {
        models.User.find({ where: { email: email } }).then(function (found) {

            var user = {
                'id': found.id,
                'email': found.email,
                'password': found.password
            }
            done(null, user);
        }).catch(function (error) {
            console.log("ops: " + error);
            done(error);
        });
    });
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            var user = {
                'email': email,
                'password': password
            }
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                
                models.User.find({ where: { email: email } }).then(function (found) {
                    // if the user is found but the password is wrong
                    if (found) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {

                        bcrypt.genSalt(10, function (err, salt) {
                            console.log('SALT : ' + salt);
                            bcrypt.hash(password, salt, function (err, hash) {
                                // Store hashed password in DB.
                                user.password = hash;
                                models.User.create(user).then(function (user) {
                                    log.debug("Created user: " + user.id);
                                    return done(null, user);
                                }).catch(function (error) {
                                    console.log("ops: " + error);
                                    return done(null, false, req.flash('signupMessage', 'Internal server error' + error));
                                });
                            });
                        });

                    }
                }).catch(function (error) {
                    console.log("ops: " + error);
                    // reply with error
                    return done(error);
                });
            });
        }));
    
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
        function (req, email, password, done) { // callback with email and password
        
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            models.User.find({ where: { email: email } }).then(function (found) {
                // if the user is found but the password is wrong
                if (found) {                    
                    // compare passwords
                    bcrypt.compare(password, found.password, function (err, result) {
                        if (err || !result)
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        // else return result      
                        return done(null, found);
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
        
        
              