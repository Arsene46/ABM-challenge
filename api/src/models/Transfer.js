const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define("transfer", {
    concept: {
      type: DataTypes.TEXT,
    },
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("gain", "loss"),
      allowNull: false,
    },
  });
};
