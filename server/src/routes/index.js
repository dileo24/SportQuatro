const express = require("express");

const Admin = require("./admin");
const Autos = require("./autos");
const files = require("./uploadFiles");
const router = express();
router.use(express.json());

router.use("/admin", Admin);
router.use("/autos", Autos);
router.use("/files", files);
router.get("/favicon.ico", (req, res) => res.status(204).end());
router.all("*", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});


module.exports = router;