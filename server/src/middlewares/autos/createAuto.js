const { Auto, Categoria } = require("../../db");

const createAuto = async (req, res, next) => {
  try {
    const { auto } = req.body;
    const categ = await Categoria.findByPk(auto.id_categ);

    const newAuto = await Auto.create({
      auto,
    });
    await newAuto.setCategoria(categ);

    req.body = {
      status: "200",
      resp: `El auto ${auto} se ha creado exitosamente!`,
    };
    next();
  } catch (err) {
    req.body = { status: "404", resp: err.message };
    next();
  }
};

module.exports = createAuto;
