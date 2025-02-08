const { Admin } = require("../../db");
const { checkers } = require("../../helpers/checkers");
const { compare } = require("../../helpers/handleCrypt");

const login = async (req, res, next) => {
  try {
    let { email, pass } = req.body;

    const errors = [];
    await checkAndPushError(errors, "email", email);
    pass === undefined || (pass === "" && (await checkAndPushError(errors, "pass", pass)));

    if (errors.length > 0) {
      req.body = { status: 400, errors };
      return next();
    }

    email = email.trim().toLowerCase();

    let user;
      user = await Admin.findOne({
        where: { email: email },
      });

    if (!user) {
      errors.push({ resp: "Su email no se encuentra registrado.", input: "email" });
      req.body = { status: 400, errors };
      return next();
    }
    const checkPass = await compare(pass, user.pass);

    if (checkPass) {
      req.body = { status: 200, resp: user };
      next();
    } else {
      errors.push({ resp: "¡Contraseña incorrecta!", input: "pass" });
      req.body = { status: 400, errors };
      return next();
    }
  } catch (err) {
    req.body = { status: 404, resp: err.message };
    next();
  }
};

async function checkAndPushError(errors, type, data) {
  try {
    if (data === undefined || data === null) {
      data = "";
    }
    await checkers(type, data);
  } catch (err) {
    errors.push({ resp: err.resp, input: err.input });
  }
}

module.exports = login;
