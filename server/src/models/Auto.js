const { DataTypes } = require("sequelize");
module.exports = sequelize => {
  sequelize.define(
    "Auto",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modelo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      motor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      anio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      km: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transmision: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      combustible: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
};
