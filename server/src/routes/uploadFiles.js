const sharp = require("sharp");
const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const path = require("path");
const fs = require("fs"); // Necesario para manejo de archivos

const router = Router();

// Crear el directorio uploads si no existe
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = {
      status: 400,
      resp: "El formato del archivo no es válido! Solo se permiten imágenes (PNG, JPEG, JPG).",
      input: "file",
    };
    callback(error);
  }
};

const helperImg = async (filePath, fileName, size = 300) => {
  const outputFilePath = path.join(uploadDir, fileName);
  try {
    await sharp(filePath).resize(size).toFormat("webp").toFile(outputFilePath);

    // Eliminar el archivo original después de procesarlo
    fs.unlinkSync(filePath);

    return outputFilePath;
  } catch (error) {
    // Si hay un error, eliminar el archivo original también
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(null, `img_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage, fileFilter });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, resp: "No se proporcionó ningún archivo." });
    }

    const fileName = `${req.file.filename.replace(path.extname(req.file.filename), ".webp")}`;
    await helperImg(req.file.path, fileName);

    res.status(200).json({ status: 200, resp: true, fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      resp: "Error al procesar la imagen.",
      error: error.message,
    });
  }
});

router.use("/", express.static(uploadDir));

module.exports = router;
