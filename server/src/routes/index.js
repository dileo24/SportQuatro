const express = require("express");
const router = express.Router();

const Admin = require("./admin");
const Autos = require("./autos");
const files = require("./uploadFiles");
const sendCarFormEmail = require("../middlewares/emails/compramos_email");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/admin", Admin);
router.use("/autos", Autos);
router.use("/files", files);

router.post("/compramos-tu-auto", sendCarFormEmail, async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: "Solicitud procesada correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      error: "Error al guardar los datos",
    });
  }
});

router.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

module.exports = router;
