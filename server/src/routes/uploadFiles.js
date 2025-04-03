const sharp = require("sharp");
const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const path = require("path");

const router = Router();

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

const helperImg = (filePath, fileName, size = 300) => {
  const outputFilePath = path.join(__dirname, `../optimize/${fileName}.webp`); // Guardar en formato WebP
  return sharp(filePath)
    .resize(size)
    .toFormat("webp") // Convertir a WebP
    .toFile(outputFilePath);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    let prefix = "";
    if (file.mimetype.startsWith("image/")) {
      prefix = "img";
    }
    callback(null, `${prefix}_${Date.now()}.webp`);
  },
});

const upload = multer({ dest: "uploads" });

const uploadFile = multer({ storage, fileFilter });

router.post("/", uploadFile.single("file"), async (req, res) => {
  try {
    const fileName = req.file.filename;
    const filePath = req.file.path;

    await helperImg(filePath, fileName);

    res.status(200).json({ status: 200, resp: true, fileName: `${fileName}` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, resp: "Error al procesar la imagen.", error: error.message });
  }
});

router.use("/", express.static(path.join(__dirname, "../../uploads")));

module.exports = router;
