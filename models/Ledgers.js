module.exports = function (sequelize, DataTypes) {
    var Ledgers = sequelize.define('Ledgers', {
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
        txId: {
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
    return Ledgers;
};
