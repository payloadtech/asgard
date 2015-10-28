module.exports = function (sequelize, DataTypes) {
    var Invoice = sequelize.define('Ledgers', {
		// invoice id
        invoiceId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // currency of price
        invoiceCurrency: {
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
        invoiceAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },     
        // description
        description: {
            type: DataTypes.STRING(100),
        }     
    });
    return Invoice;
};
