const { Auto } = require("../../db");

const deleteAuto = async (req, res) => {
  try {
    let { id } = req.params;
    id = Number(id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ status: "400", resp: "El ID debe ser un número válido." });
    }

    const auto = await Auto.findByPk(id);
    if (!auto) {
      return res.status(404).json({ status: "404", resp: "Auto no encontrado." });
    }
    await auto.destroy();

    return res.status(200).json({
      status: "200",
      resp: `El auto con ID ${id} ha sido eliminado correctamente.`,
    });
  } catch (err) {
    return res.status(500).json({ status: "500", resp: err.message });
  }
};

module.exports = deleteAuto;
