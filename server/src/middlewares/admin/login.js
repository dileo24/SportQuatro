const { Admin } = require("../../db");
const { checkers } = require("../../helpers/checkers");
const { compare } = require("../../helpers/handleCrypt");

const login = async (req, res) => {
  try {
    let { email, pass } = req.body;
    const errors = [];

    if (!email) await checkAndPushError(errors, "email", email);
    if (!pass) await checkAndPushError(errors, "pass", pass);

    if (errors.length > 0) {
      return res.status(400).json({ status: 400, errors });
    }

    email = email.trim().toLowerCase();

    const user = await Admin.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        status: 400,
        errors: [{ resp: "Su email no se encuentra registrado.", input: "email" }],
      });
    }

    const checkPass = await compare(pass, user.pass);
    if (!checkPass) {
      return res.status(400).json({
        status: 400,
        errors: [{ resp: "¡Contraseña incorrecta!", input: "pass" }],
      });
    }

    return res.status(200).json({
      status: 200,
      resp: true,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err });
  }
};

async function checkAndPushError(errors, type, data) {
  try {
    await checkers(type, data);
  } catch (err) {
    errors.push({ resp: err.resp, input: err.input });
  }
}

module.exports = login;
