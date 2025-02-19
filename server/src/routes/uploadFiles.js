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
  const outputFilePath = path.join(__dirname, `../optimize/${fileName}`);
  return sharp(filePath).resize(size).toFile(outputFilePath);
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
    const ext = file.originalname.split(".").pop();
    callback(null, `${prefix}_${Date.now()}.${ext}`);
  },
});

const upload = multer({ dest: "uploads" }); //cargar nombre de carpeta destino

const uploadFile = multer({ storage, fileFilter });

router.post("/", uploadFile.single("file"), async (req, res) => {
  const fileName = req.file.filename;
  res.status(200).json({ status: 200, resp: true, fileName });
});

router.use("/", express.static(path.join(__dirname, "../../uploads")));

module.exports = router;
