const { Auto, Categoria } = require("../../db");

const createAuto = async (req, res, next) => {
  try {
    const auto = req.body;
    const categorias = await Categoria.findAll({
      where: { id: auto.id_categ },
    });
    const newAuto = await Auto.create(auto);

    if (categorias.length > 0) {
      await newAuto.setCategorias(categorias);
    }

    res.status(200).json({
      status: "200",
      resp: `El auto ${newAuto.modelo} se ha creado exitosamente.`,
      id: newAuto.id,
    });
  } catch (err) {
    res.status(404).json({ status: "404", resp: err.message });
  }
};

module.exports = createAuto;
