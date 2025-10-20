const { Auto, Categoria } = require("../../db");
const { Sequelize } = require("sequelize");

const allAutos = async (req, res, next) => {
  try {
    const allAutos = await Auto.findAll({
      include: [
        {
          model: Categoria,
          as: "categorias",
          through: { attributes: [] },
        },
      ],
      order: Sequelize.literal('RANDOM()')
    });

    res.status(200).json({
      status: 200,
      resp: allAutos,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = allAutos;