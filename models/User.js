module.exports = function (sequelize, DataTypes) {
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
      type: DataTypes.STRING
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
    }
  });
  return User;
};
