const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define("register", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
