const { Router } = require("express");
const allAutos = require("../middlewares/autos/allAutos");
const createAuto = require("../middlewares/autos/createAuto");
const deleteAuto = require("../middlewares/autos/deleteAuto");
const updateAuto = require("../middlewares/autos/updateAuto");
const getAutosDestacados = require("../middlewares/autos/getAutosDestacados");
const getAutoById = require("../middlewares/autos/getAutoByID");

const router = Router();

router.get("/", allAutos);

router.get("/destacados", getAutosDestacados);

router.get("/:id", getAutoById);

router.post("/", createAuto);

router.delete("/:id", deleteAuto);

router.put("/:id", updateAuto);

module.exports = router;
