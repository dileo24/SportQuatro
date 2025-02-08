const { Router } = require("express");
const allAutos = require("../middlewares/autos/allAutos");
const createAuto = require("../middlewares/autos/createAuto");
const deleteAuto = require("../middlewares/autos/deleteAuto");
const updateAuto = require("../middlewares/autos/updateAuto");

const router = Router();

router.get("/", allAutos, async (req, res) => {
  return res.json(req.body);
});

router.post("/", createAuto, async (req, res) => {
  return res.status(200).send(req.body);
});

router.delete("/:id", deleteAuto, async (req, res) => {
  return res.json(req.body);
});

router.put("/:id", updateAuto, async (req, res) => {
  return res.json(req.body);
});

module.exports = router;
