module.exports = function(sequelize, DataTypes) {
  var Bill = sequelize.define('Bill', {

    owner: { // creator of the bill
      type: DataTypes.STRING
    },

    createdDate: { // Time of bill creation
      type: DataTypes.DATE
    },

    delivered: { // Indicates whether bill has been delivered to buyer
      type: DataTypes.BOOLEAN
    },

    merchantBillId: { // Bill identifier, specified by merchant
      type: DataTypes.STRING
    },

    status: { // Can be `draft`, `sent`, `paid`, `complete`, or `expired`
      type: DataTypes.STRING
    },

    currency: { // ISO 4217 3-character currency code
      type: DataTypes.STRING
    },

    showRate: { // Indicates whether corresponding invoice web page should display equivalent fiat amount
      type: DataTypes.BOOLEAN
    },

    archived: { // Indicates whether bill is visible in BitPay website
      type: DataTypes.BOOLEAN
    },

    // buyer details
    name: { // Buyer Name
      type: DataTypes.STRING
    },

    address1: { // Buyer Street Address
      type: DataTypes.STRING
    },

    address2: { // Buyer Apartment or Suite Number
      type: DataTypes.STRING
    },

    city: { // Buyer Locality or City
      type: DataTypes.STRING
    },

    state: { // Buyer State or province
      type: DataTypes.STRING
    },

    zip: { // Buyer Zip or Postal Code
      type: DataTypes.STRING
    },

    country: { // Buyer Country Code (ISO 3166-1 alpha-2)
      type: DataTypes.STRING
    },

    email: { // Buyer Email
      type: DataTypes.STRING
    },

    phone: { // Buyer Phone
      type: DataTypes.STRING
    },
    dueDate: { // UTC date, ISO-8601 format yyyy-mm-dd or yyyy-mm-ddThh:mm:ssZ. Default is current time.
      type: DataTypes.DATE
    },
    expireDate: { // UTC date, ISO-8601 format yyyy-mm-dd or yyyy-mm-ddThh:mm:ssZ. Default is current time.
      type: DataTypes.DATE
    }
  });
  return Bill;
};
