const { Router } = require("express");
const allAutos = require("../middlewares/autos/allAutos");
const { Sequelize } = require("sequelize");
const createAuto = require("../middlewares/autos/createAuto");
const deleteAuto = require("../middlewares/autos/deleteAuto");
const updateAuto = require("../middlewares/autos/updateAuto");
const getAutosDestacados = require("../middlewares/autos/getAutosDestacados");
const getAutoById = require("../middlewares/autos/getAutoByID");
const getAutosByCategoria = require("../middlewares/autos/getAutoByCateg");
const { Auto } = require("../db");

const router = Router();

router.get("/", allAutos);

router.get("/destacados", getAutosDestacados);

router.get("/marcas", async (req, res) => {
  try {
    const marcas = await Auto.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("marca")), "marca"]],
      order: [["marca", "ASC"]],
    });
    res.json(marcas.map(item => item.marca));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.post("/relacionados", getAutosByCategoria);

router.get("/:id", getAutoById);

router.post("/", createAuto);

router.delete("/:id", deleteAuto);

router.put("/:id", updateAuto);

module.exports = router;
