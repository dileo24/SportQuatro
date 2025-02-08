const { Auto, Categoria } = require("../../db");

const updateAuto = async (req, res, next) => {
  try {
    const { auto } = req.body;

    const id = req.params.id;
    const AutoFinded = await Auto.findByPk(id);

    if (AutoFinded.length !== 0) {
      if (auto.id_categ) {
        const categ = await Categoria.findByPk(auto.id_categ);
        if (!categ) {
          throw new Error(`Categoria con id ${auto.id_categ} no encontrada.`);
        }
        await AutoFinded.setCategoria(categ);
      }

      await AutoFinded.update(
        {
          auto: auto || AutoFinded.auto,
        },
        { where: { id: AutoFinded.id } },
      );
      req.body = {
        status: 200,
        resp: `El auto ${auto.modelo} se ha actualizado exitosamente`,
      };
      next();
    } else {
      throw new Error(`Auto con id: ${id} no encontrado`);
    }
  } catch (error) {
    req.body = {
      status: 400,
      resp: error.message,
    };
  }
};

module.exports = updateAuto;
