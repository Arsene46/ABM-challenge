const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define("register", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
