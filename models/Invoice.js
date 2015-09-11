"use strict";
module.exports = function (sequelize, DataTypes) {
    var Invoice = sequelize.define('Invoice', {
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // currency of price
        currency: {
            type: DataTypes.STRING,
            defaultValue: "PKR",
            isIn: [["PKR", "USD", "BTC"]],
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // units of currency per bitcoin
        rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // invoice amount in bitcoin
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        btcAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        transactionId: {
            type: DataTypes.STRING,
        },
        // notification settings
        notificationUrl: {
            type: DataTypes.STRING,
        },
        // confirmations required for invoice to be marked as complete, default is 3
        confirmationSpeed: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        },
        confirmations: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        redirectUrl: {
            type: DataTypes.STRING,
        },
        // item description
        itemDesc: {
            type: DataTypes.STRING(100),
        },
        // others
        physical: {
            type: DataTypes.BOOLEAN,
            defaultsTo: false
        },
        // buyer details
        buyerName: {
            type: DataTypes.STRING,
        },
        buyerAddress: {
            type: DataTypes.STRING,
        },
        buyerLocality: {
            type: DataTypes.STRING,
        },
        buyerRegion: {
            type: DataTypes.STRING,
        },
        buyerPostelCode: {
            type: DataTypes.STRING,
        },
        buyerCountry: {
            type: DataTypes.STRING,
        },
        buyerEmail: {
            type: DataTypes.STRING,
            email: true
        },
        buyerPhone: {
            type: DataTypes.INTEGER,
        },
        // status of invoice i.e confirmed
        status: {
            type: DataTypes.STRING,
            defaultValue: "unpaid",
        },
        // exception for paidOver or paidPartial, or false
        exception: {
            type: DataTypes.BOOLEAN,
        }
    });
    return Invoice;
};
