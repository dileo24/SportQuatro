const express = require("express");
const router = express.Router();

const Admin = require("./admin");
const Autos = require("./autos");
const files = require("./uploadFiles");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/admin", Admin);
router.use("/autos", Autos);
router.use("/files", files);
router.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

module.exports = router;
