var Sequelize = require('sequelize');
var sequelize = new Sequelize('../config/sequelize');

var Invoice = sequelize.define('invoice', {
    price: {
        type: Sequelize.FLOAT,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    // currency of price
    currency: {
        type: Sequelize.STRING,
        defaultValue: "PKR",
        isIn: [["PKR", "USD", "BTC"]],
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    // units of currency per bitcoin
    rate: {
        type: Sequelize.FLOAT,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    // invoice amount in bitcoin
    amount: {
        type: Sequelize.FLOAT,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    btcAddress: {
        type: Sequelize.STRING,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    transactionId: {
        type: Sequelize.STRING,
    },
    // notification settings
    notificationUrl: {
        type: Sequelize.STRING,
    },
    // confirmations required for invoice to be marked as complete, default is 3
    confirmationSpeed: {
        type: Sequelize.INTEGER,
        defaultValue: 3
    },
    confirmations: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    redirectUrl: {
        type: Sequelize.STRING,
    },
    // item description
    itemDesc: {
        type: Sequelize.STRING(100),
    },
    // others
    physical: {
        type: Sequelize.BOOLEAN,
        defaultsTo: false
    },
    // buyer details
    buyerName: {
        type: Sequelize.STRING,
    },
    buyerAddress: {
        type: Sequelize.STRING,
    },
    buyerLocality: {
        type: Sequelize.STRING,
    },
    buyerRegion: {
        type: Sequelize.STRING,
    },
    buyerPostelCode: {
        type: Sequelize.STRING,
    },
    buyerCountry: {
        type: Sequelize.STRING,
    },
    buyerEmail: {
        type: Sequelize.STRING,
        email: true
    },
    buyerPhone: {
        type: Sequelize.INTEGER,
    },
    // status of invoice i.e confirmed
    status: {
        type: Sequelize.STRING,
        defaultValue: "unpaid",
    },
    // exception for paidOver or paidPartial, or false
    exception: {
        type: Sequelize.BOOLEAN,
    }
});

