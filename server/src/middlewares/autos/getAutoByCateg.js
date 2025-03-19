const { Op } = require("sequelize");
const { Auto, Categoria } = require("../../db");

const getAutosByCategoria = async (req, res) => {
  try {
    const { id_categ } = req.body;

    if (!id_categ) {
      return res.status(400).json({ error: "Debe proporcionar al menos una categoría." });
    }

    const categoriasArray = Array.isArray(id_categ) ? id_categ.map(Number) : [Number(id_categ)];

    const autos = await Auto.findAll({
      include: [
        {
          model: Categoria,
          as: "categorias",
          through: { attributes: [] },
          where: { id: { [Op.in]: categoriasArray } },
        },
      ],
    });

    if (!autos.length) {
      return res.status(404).json({ error: "No se encontraron autos en estas categorías." });
    }

    res.status(200).json({
      status: 200,
      resp: autos,
    });
  } catch (err) {
    console.error("Error al obtener autos por categoría:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = getAutosByCategoria;
