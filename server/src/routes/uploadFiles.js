const sharp = require("sharp");
const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");

const router = Router();

// Configuración de directorios
const uploadDir = path.join(__dirname, "../../uploads");
const carouselDir = path.join(uploadDir, "carousel");

// Crear directorios si no existen
[uploadDir, carouselDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de Multer
const fileFilter = (req, file, cb) => {
  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({
      status: 400,
      resp: "Formato no válido. Use: PNG, JPEG, JPG o WEBP",
      input: "file",
      storageErrors: [],
    });
  }
};

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `img_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Procesamiento de imágenes
const processImage = async buffer => {
  return sharp(buffer)
    .toFormat("webp", {
      quality: 90,
      lossless: false,
      effort: 4,
    })
    .toBuffer();
};

// Helpers para URLs
const getFileUrl = (req, fileName, isCarousel = false) => {
  const prefix = isCarousel ? "/files/carousel" : "/files";
  return `${req.protocol}://${req.get("host")}${prefix}/${fileName}`;
};

// ========== Endpoints para el Carrusel ========== //

// GET /files/carousel - Listar imágenes del carrusel
router.get("/carousel", async (req, res) => {
  try {
    const files = fs
      .readdirSync(carouselDir)
      .filter(file => file.match(/\.(webp|jpeg|jpg|png)$/i))
      .map(file => ({
        name: file,
        path: `/files/carousel/${file}`,
        url: getFileUrl(req, file, true),
      }));

    res.status(200).json({
      status: 200,
      resp: true,
      files,
      count: files.length,
      message: "Imágenes del carrusel obtenidas exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener imágenes del carrusel:", error);
    res.status(500).json({
      status: 500,
      resp: "Error al obtener imágenes del carrusel",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// POST /files/carousel - Agregar imágenes al carrusel
router.post("/carousel", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 400, resp: "Archivos requeridos" });
    }

    const existingFiles = fs.readdirSync(carouselDir);
    const remainingSlots = Math.max(0, 10 - existingFiles.length);

    if (remainingSlots === 0) {
      return res.status(400).json({
        status: 400,
        resp: "Ya hay 10 imágenes en el carrusel. Elimina alguna antes de agregar nuevas.",
      });
    }

    const filesToProcess = req.files.slice(0, remainingSlots);
    const results = [];

    for (const file of filesToProcess) {
      try {
        const buffer = await fs.promises.readFile(file.path);
        await fs.promises.unlink(file.path).catch(console.error);

        const webpBuffer = await processImage(buffer);
        const webpFilename = file.filename.replace(/\.[^/.]+$/, ".webp");
        const webpPath = path.join(carouselDir, webpFilename);

        await fs.promises.writeFile(webpPath, webpBuffer);
        results.push({
          name: webpFilename,
          path: `/files/carousel/${webpFilename}`,
          url: getFileUrl(req, webpFilename, true),
        });
      } catch (error) {
        console.error(`Error procesando ${file.originalname}:`, error);
      }
    }

    if (results.length === 0) {
      return res.status(500).json({
        status: 500,
        resp: "Error al procesar las imágenes",
      });
    }

    res.status(200).json({
      status: 200,
      resp: true,
      files: results,
      message: `Imágenes agregadas al carrusel (${results.length}/${remainingSlots})`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      resp: "Error al procesar imágenes del carrusel",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// DELETE /files/carousel/:fileName - Eliminar imagen del carrusel
router.delete("/carousel/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName || fileName.includes("..") || fileName.includes("/")) {
      return res.status(400).json({
        status: 400,
        resp: "Nombre de archivo no válido",
      });
    }

    const filePath = path.join(carouselDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 404,
        resp: "Archivo no encontrado",
      });
    }

    await fs.promises.unlink(filePath);

    res.status(200).json({
      status: 200,
      resp: true,
      message: "Imagen eliminada del carrusel exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar imagen del carrusel:", error);
    res.status(500).json({
      status: 500,
      resp: "Error al eliminar la imagen del carrusel",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// ========== Endpoints generales para uploads ========== //

// POST /files - Subir archivo general
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, resp: "Archivo requerido" });
    }
    const buffer = await fs.promises.readFile(req.file.path);
    await fs.promises.unlink(req.file.path).catch(console.error);

    const webpBuffer = await processImage(buffer);
    const webpFilename = req.file.filename.replace(/\.[^/.]+$/, ".webp");
    const webpPath = path.join(uploadDir, webpFilename);

    await fs.promises.writeFile(webpPath, webpBuffer);

    res.status(200).json({
      status: 200,
      resp: true,
      fileName: webpFilename,
      filePath: `/files/${webpFilename}`,
      url: getFileUrl(req, webpFilename),
      message: "Imagen procesada exitosamente",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      resp: "Error al procesar imagen",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// DELETE /files/:fileName - Eliminar archivo general
router.delete("/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName || fileName.includes("..") || fileName.includes("/")) {
      return res.status(400).json({
        status: 400,
        resp: "Nombre de archivo no válido",
      });
    }

    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 404,
        resp: "Archivo no encontrado",
      });
    }

    await fs.promises.unlink(filePath);

    res.status(200).json({
      status: 200,
      resp: true,
      message: "Imagen eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({
      status: 500,
      resp: "Error al eliminar la imagen",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
});

// ========== Servir archivos estáticos ========== //

// Servir archivos del carrusel
router.use(
  "/carousel",
  express.static(carouselDir, {
    maxAge: "1y",
    setHeaders: (res, path) => {
      if (path.endsWith(".webp")) res.type("webp");
    },
  }),
);

// Servir archivos generales
router.use(
  "/",
  express.static(uploadDir, {
    maxAge: "1y",
    setHeaders: (res, path) => {
      if (path.endsWith(".webp")) res.type("webp");
    },
  }),
);

module.exports = router;
