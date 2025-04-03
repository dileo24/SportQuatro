const { Auto, Categoria } = require("../../db");

const updateAuto = async (req, res) => {
  try {
    const { id } = req.params;
    const auto = req.body;

    const AutoFinded = await Auto.findByPk(id);

    if (!AutoFinded) {
      return res.status(404).json({ status: "404", resp: `Auto con id: ${id} no encontrado.` });
    }

    // Actualizar categorías si vienen en el body
    if (auto.categorias && Array.isArray(auto.categorias)) {
      // Extraer solo los IDs de las categorías
      const categoriaIds = auto.categorias.map(cat => cat.id);

      // Verificar que todas las categorías existan
      const categorias = await Categoria.findAll({
        where: { id: categoriaIds },
      });

      if (categorias.length !== categoriaIds.length) {
        const foundIds = categorias.map(c => c.id);
        const missingIds = categoriaIds.filter(id => !foundIds.includes(id));
        return res.status(404).json({
          status: "404",
          resp: `Las siguientes categorías no fueron encontradas: ${missingIds.join(", ")}`,
        });
      }

      // Establecer las categorías
      await AutoFinded.setCategorias(categorias);

      // Eliminar la propiedad categorias del objeto auto para evitar conflictos
      delete auto.categorias;
    }

    // Actualizar los demás campos del auto
    await AutoFinded.update(auto);

    return res.status(200).json({
      status: 200,
      resp: `El auto ${auto.modelo || AutoFinded.modelo} se ha actualizado exitosamente.`,
    });
  } catch (error) {
    return res.status(500).json({ status: "500", resp: error.message });
  }
};

module.exports = updateAuto;
