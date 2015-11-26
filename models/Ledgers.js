module.exports = function (sequelize, DataTypes) {
    var Invoice = sequelize.define('Invoice', {
        // amount in bitcoin
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // amount came from
        from: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // amount sent to
        to: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // transaction id
        refId: {
             type: DataTypes.STRING,
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
        // bank ref
        bankref: {
             type: DataTypes.STRING
        },
        // description
        description: {
            type: DataTypes.STRING(200)
        }
    });
    var Merchant = sequelize.define('Merchant', {
        // amount in bitcoin
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // amount came from
        from: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // amount sent to
        to: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // transaction id
        refId: {
             type: DataTypes.STRING,
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
        // bank ref
        bankref: {
             type: DataTypes.STRING
        },
        // description
        description: {
            type: DataTypes.STRING(200)
        }
    });
    var Exchange = sequelize.define('Exchange', {
        // amount in PKR
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // amount came from
        from: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // amount sent to
        to: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // transaction id
        refId: {
             type: DataTypes.STRING,
        },
        // currency of price
        currency: {
            type: DataTypes.STRING,
            defaultValue: "PKR",
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
        // bank ref
        bankref: {
             type: DataTypes.STRING
        },
        // description
        description: {
            type: DataTypes.STRING(200)
        }
    });
    Merchant.hasMany(Invoice, {as: 'Invoice'});
    Exchange.hasMany(Merchant,{as: 'Merchant'});
    return Exchange;
};
