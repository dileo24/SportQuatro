const sharp = require("sharp");
const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");

const router = Router();

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
  limits: { fileSize: 10 * 1024 * 1024 },
});

const processImage = async buffer => {
  return sharp(buffer)
    .toFormat("webp", {
      quality: 90,
      lossless: false,
      effort: 4,
    })
    .toBuffer();
};

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
