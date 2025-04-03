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
      moneda: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destacar: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      oferta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      precio_oferta: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      timestamps: false,
    },
  );
};
