module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    // first name
    name: {
      type: DataTypes.STRING,
    },
    // amount
    amount: {
      type: DataTypes.INTEGER,
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
    },
    dob: {
      type: DataTypes.STRING,
    },
    cnic: {
      type: DataTypes.STRING,
      validate: {
        is: /^[1-4]{1}[0-9]{4}(-)?[0-9]{7}(-)?[0-9]{1}$/
      }
    },
    ntn: {
      type: DataTypes.STRING,
    },
    fatherName: {
      type: DataTypes.STRING,
    },
    occupation: {
      type: DataTypes.TEXT,
    },
    cellNo: {
      type: DataTypes.STRING,
    },
    landLineNo: {
      type: DataTypes.STRING,
    },
    parmanentAdd: {
      type: DataTypes.TEXT,
    },
    mailAdd: {
      type: DataTypes.TEXT,
    },
    bankAccNo: {
      type: DataTypes.STRING,

    },
    bankName: {
      type: DataTypes.STRING,
    },
    // the current status of the user,
    verified: {
      type: DataTypes.STRING,
      defaultValue: "unverified" // "unverified", "verified", "suspended", or disabled
    },
    // the type of user
    type: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
      valdate: {
        isIn: [
          ['user', 'admin']
        ],
      }
    }
  });
  return User;
};
