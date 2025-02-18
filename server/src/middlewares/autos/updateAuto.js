const { Auto, Categoria } = require("../../db");

const updateAuto = async (req, res) => {
  try {
    const { id } = req.params;
    const auto = req.body;

    const AutoFinded = await Auto.findByPk(id);

    if (!AutoFinded) {
      return res.status(404).json({ status: "404", resp: `Auto con id: ${id} no encontrado.` });
    }

    if (auto.id_categ) {
      let categorias;
      if (Array.isArray(auto.id_categ)) {
        categorias = await Categoria.findAll({
          where: { id: auto.id_categ },
        });
        if (categorias.length !== auto.id_categ.length) {
          return res.status(404).json({ status: "404", resp: "Algunas categorías no fueron encontradas." });
        }
      } else {
        categorias = await Categoria.findByPk(auto.id_categ);
        if (!categorias) {
          return res.status(404).json({ status: "404", resp: `Categoría con id ${auto.id_categ} no encontrada.` });
        }
      }

      await AutoFinded.setCategorias(categorias);
    }

    await AutoFinded.update(auto);

    return res.status(200).json({
      status: "200",
      resp: `El auto ${auto.modelo || AutoFinded.modelo} se ha actualizado exitosamente.`,
    });

  } catch (error) {
    return res.status(500).json({ status: "500", resp: error.message });
  }
};

module.exports = updateAuto;
