const { verifyToken } = require("../../helpers/generateToken");

const checkAuth = async (req, res, next) => {
  //verifica que un usuario tenga un token válido, que sea sesión válida
  try {
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await verifyToken(token);
    console.log(tokenData);
    if (tokenData.id) {
      next();
    } else {
      return res
        .status(409)
        .send({ error: "¡No tenés permiso de entrar acá!" });
    }
  } catch (error) {
    return res.status(409).send({ error: "¡No tenés permiso de entrar acá!" });
  }
};

module.exports = checkAuth;
