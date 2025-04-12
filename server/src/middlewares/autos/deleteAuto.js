const { Auto } = require("../../db");
const fs = require("fs").promises;
const path = require("path");

const carouselDir = path.join(__dirname, "../../../uploads");

const deleteAuto = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (!numericId || isNaN(numericId)) {
      return res.status(400).json({
        status: "400",
        resp: "El ID debe ser un número válido.",
      });
    }

    const auto = await Auto.findByPk(numericId);
    if (!auto) {
      return res.status(404).json({
        status: "404",
        resp: "Auto no encontrado.",
      });
    }

    if (auto.img && Array.isArray(auto.img)) {
      await Promise.all(
        auto.img.map(async fileName => {
          try {
            if (!fileName || fileName.includes("..") || fileName.includes("/")) {
              console.warn(`Nombre de archivo no válido: ${fileName}`);
              return;
            }

            const filePath = path.join(carouselDir, fileName);

            try {
              await fs.access(filePath);
              await fs.unlink(filePath);
              console.log(`Imagen eliminada: ${fileName}`);
            } catch (fsError) {
              if (fsError.code === "ENOENT") {
                console.warn(`Archivo no encontrado: ${fileName}`);
              } else {
                throw fsError;
              }
            }
          } catch (error) {
            console.error(`Error procesando ${fileName}:`, error);
          }
        }),
      );
    }

    await auto.destroy();

    return res.status(200).json({
      status: "200",
      resp: `Auto con ID ${numericId} y sus imágenes eliminados correctamente.`,
    });
  } catch (err) {
    console.error("Error en deleteAuto:", err);
    return res.status(500).json({
      status: "500",
      resp: "Error interno del servidor",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = deleteAuto;
