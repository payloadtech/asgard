var bcrypt = require('bcryptjs');

"use strict";
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        // first name
        fName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // last name
        lName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // email id
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        // password
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [4, 200]
            }
        }
    }
        );
    return User;
};