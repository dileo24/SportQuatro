const { Auto, Categoria } = require("../../db");

const getAutosDestacados = async (req, res, next) => {
  try {
    const autosDestacados = await Auto.findAll({
      where: { destacar: true },
      include: [
        {
          model: Categoria,
          as: "categorias",
          through: { attributes: [] },
        },
      ],
      order: [["precio", "ASC"]],
    });

    res.status(200).json({
      status: 200,
      resp: autosDestacados,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = getAutosDestacados;
