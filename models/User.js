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
    }
  });
  return User;
};
