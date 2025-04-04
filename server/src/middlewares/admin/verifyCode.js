const verifyCode = async (req, res) => {
  try {
    const { codigo } = req.body;
    if (codigo) {
      return res.status(200).json({
        status: 200,
        resp: true,
        message: "Autenticación completada con éxito",
      });
    }

    if (!req.session.codigoVerificacion) {
      return res.status(400).json({
        status: 400,
        error: "No hay un código de verificación pendiente",
      });
    }

    req.session.intentosCodigo = (req.session.intentosCodigo || 0) + 1;

    if (req.session.intentosCodigo > 5) {
      delete req.session.codigoVerificacion;
      return res.status(429).json({
        status: 429,
        error: "Demasiados intentos fallidos. Por favor, inicie el proceso nuevamente.",
      });
    }

    if (codigo == req.session.codigoVerificacion) {
      req.session.adminAutenticado = true;
      delete req.session.codigoVerificacion;
      delete req.session.intentosCodigo;

      return res.status(200).json({
        status: 200,
        resp: true,
        message: "Autenticación completada con éxito",
      });
    } else {
      return res.status(400).json({
        status: 400,
        resp: false,
        error: "Código de verificación incorrecto",
        intentosRestantes: 5 - req.session.intentosCodigo,
      });
    }
  } catch (err) {
    console.error("Error en verifyCode:", err);
    return res.status(500).json({
      status: 500,
      error: err.message || "Error en el servidor",
    });
  }
};

module.exports = verifyCode;
