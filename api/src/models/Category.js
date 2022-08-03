const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define("category", {
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM("gain", "loss", "both"),
      allowNull: false,
      defaultValue: "both",
    },
  });
};
