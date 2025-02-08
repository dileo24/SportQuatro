const { Auto } = require("../../db");

const deleteAuto = async (req, res, next) => {
  try {
    const id = req.params.id;
    const auto = await Auto.findByPk(id);
    if (!auto) {
      throw new Error(`No existe el auto con ID: ${id}`);
    } else {
      await Auto.destroy({ where: { id: auto.id } });
      req.body = {
        status: 200,
        resp: `El auto ${auto.modelo} ha sido eliminado`,
      };
      next();
    }
  } catch (err) {
    console.log(err);
    req.body = { status: 404, resp: err.message };
    next();
  }
};

module.exports = deleteAuto;
