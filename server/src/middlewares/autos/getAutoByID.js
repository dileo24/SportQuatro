const { Auto, Categoria } = require("../../db");

const getAutoById = async (req, res) => {
  try {
    const { id } = req.params;
    const autos = await Auto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: "categorias",
          through: { attributes: [] },
        },
      ],
    });

    if (!autos) {
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    res.status(200).json({
      status: 200,
      resp: autos,
    });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = getAutoById;