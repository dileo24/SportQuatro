const sharp = require("sharp");
const express = require("express");
const multer = require("multer");
const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const os = require("os");

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDir = path.join(os.tmpdir(), "uploads");
const carouselDir = path.join(uploadDir, "carousel");

[uploadDir, carouselDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

const uploadToCloudinary = (buffer, folder = "general") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        format: "webp",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        const id = result.public_id.split("/").pop();
        resolve({
          ...result,
          id,
          folder, // Añadimos la carpeta por si acaso
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async publicId => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    return {
      success: result.result === "ok",
      details: result,
    };
  } catch (error) {
    console.error("Error detallado al eliminar:", {
      message: error.message,
      publicId,
      stack: error.stack,
    });
    return {
      success: false,
      error,
    };
  }
};

// ========== Endpoints para el Carrusel ========== //

// GET /files/carousel
router.get("/carousel", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "carousel/",
      max_results: 10,
    });

    const files = result.resources.map(file => ({
      fileName: file.public_id.split("/").pop(),
      url: file.secure_url,
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

// GET /files/carousel/:id - Versión mejorada
router.get("/carousel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await cloudinary.api.resource(`carousel/${id}`).catch(error => {
      console.error("Error al verificar imagen:", error);
      throw new Error("Imagen no encontrada");
    });

    const imageUrl = cloudinary.url(resource.public_id, {
      secure: true,
      fetch_format: "auto",
      quality: "auto",
      ...(req.query.width && { width: parseInt(req.query.width) }),
      ...(req.query.height && { height: parseInt(req.query.height) }),
      ...(req.query.crop && { crop: req.query.crop }),
    });

    res.redirect(302, imageUrl);
  } catch (error) {
    console.error("Error completo:", {
      error: error.message,
      id: req.params.id,
      timestamp: new Date().toISOString(),
    });

    res.status(error.message === "Imagen no encontrada" ? 404 : 500).json({
      status: error.message === "Imagen no encontrada" ? 404 : 500,
      resp: false,
      error: error.message,
      details:
        process.env.NODE_ENV === "development"
          ? {
              endpoint: `/files/carousel/${req.params.id}`,
              stack: error.stack,
            }
          : undefined,
    });
  }
});

// POST /files/carousel
router.post("/carousel", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 400, resp: "Archivos requeridos" });
    }

    const currentResources = await cloudinary.api.resources({
      type: "upload",
      prefix: "carousel/",
      max_results: 10,
    });

    const remainingSlots = Math.max(0, 10 - currentResources.resources.length);

    if (remainingSlots === 0) {
      return res.status(400).json({
        status: 400,
        resp: "Límite del carrusel alcanzado (10 imágenes máx.)",
      });
    }

    const filesToProcess = req.files.slice(0, remainingSlots);
    const results = [];

    for (const file of filesToProcess) {
      try {
        const buffer = await fs.promises.readFile(file.path);
        await fs.promises.unlink(file.path).catch(console.error);

        const webpBuffer = await processImage(buffer);
        const uploadResult = await uploadToCloudinary(webpBuffer, "carousel");

        results.push({
          fileName: uploadResult.id, // Solo el ID
          url: uploadResult.secure_url,
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

// DELETE /files/carousel/:id
router.delete("/carousel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const publicId = `carousel/${id}`;

    try {
      await cloudinary.api.resource(publicId);
    } catch (error) {
      console.error("Error al verificar imagen:", {
        publicId,
        error: error.message,
      });
      return res.status(404).json({
        status: 404,
        resp: "Imagen no encontrada en Cloudinary",
        details: {
          id,
          publicId,
          suggestion: "Verifique que la imagen exista en el carrusel",
        },
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

    if (result.result !== "ok") {
      return res.status(500).json({
        status: 500,
        resp: "Error al eliminar la imagen",
        details: {
          apiResponse: result,
          nextSteps: [
            "Verificar permisos de la API Key",
            "Revisar políticas de retención en Cloudinary",
          ],
        },
      });
    }

    try {
      await cloudinary.api.resource(publicId);
      return res.status(500).json({
        status: 500,
        resp: "La imagen no fue eliminada completamente",
        details: {
          apiResponse: result,
          warning: "La imagen sigue existiendo después de eliminación",
        },
      });
    } catch (verifyError) {
      return res.status(200).json({
        status: 200,
        resp: true,
        id,
        publicId,
        details: {
          deletedAt: new Date().toISOString(),
          apiResponse: result,
        },
        message: "Imagen eliminada exitosamente",
      });
    }
  } catch (error) {
    console.error("Error completo:", {
      error: error.stack,
      params: req.params,
    });

    res.status(500).json({
      status: 500,
      resp: "Error en el proceso de eliminación",
      error:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
              publicId: `carousel/${req.params.id}`,
            }
          : null,
    });
  }
});

// ========== Endpoints generales para uploads ========== //

// GET /files/:clientId
router.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: `general/${clientId}`,
      max_results: 1,
    });

    if (resources.resources.length === 0) {
      return res.status(404).send("Imagen no encontrada");
    }

    res.redirect(resources.resources[0].secure_url);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al obtener la imagen");
  }
});

// POST /files
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        resp: "Archivo requerido",
        details: "Debes enviar el archivo en el campo 'file'",
      });
    }

    const buffer = await fs.promises.readFile(req.file.path);
    await fs.promises.unlink(req.file.path).catch(console.error);

    const webpBuffer = await processImage(buffer);
    const uploadResult = await uploadToCloudinary(webpBuffer);

    const imageId = uploadResult.public_id.split("/").pop();

    res.status(200).json({
      status: 200,
      resp: true,
      fileName: imageId,
      url: uploadResult.secure_url,
      message: "Imagen procesada y subida exitosamente",
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

// DELETE /files/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        resp: "ID de imagen requerido",
      });
    }

    const publicId = `general/${id}`;
    const { success, details, error } = await deleteFromCloudinary(publicId);

    if (!success) {
      console.error("Fallo al eliminar:", {
        publicId,
        error: details || error,
      });

      return res.status(404).json({
        status: 404,
        resp: "Imagen no encontrada en Cloudinary",
        details: {
          id,
          publicId,
          apiResponse: details,
          error: process.env.NODE_ENV === "development" ? error : undefined,
        },
      });
    }

    res.status(200).json({
      status: 200,
      resp: true,
      id: id,
      publicId: publicId,
      apiResponse: details,
      message: "Imagen eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error completo al eliminar imagen:", {
      error: error.stack,
      params: req.params,
    });

    res.status(500).json({
      status: 500,
      resp: "Error al eliminar la imagen",
      error:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
            }
          : null,
    });
  }
});

module.exports = router;
