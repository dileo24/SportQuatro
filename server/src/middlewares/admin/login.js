const { Admin } = require("../../db");
const { checkers } = require("../../helpers/checkers");
const { compare } = require("../../helpers/handleCrypt");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

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

    const codigo = generarCodigo();

    const mail = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Código de verificación - SportQuatro",
      text: `Tu código de verificación es: ${codigo}`,
      html: `
        <div style="width: 100%; background-color: #7F7F7F; padding: 20px; box-sizing: border-box;">
          <div style="max-width: 600px; margin: auto; background-color: #444446; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h2 style="color: #ffffff;">¡Hola!</h2>
            <p style="font-size: 16px; color: #ffffff;">Tu código de verificación es:</p>
            <p style="margin: 20px 0; padding: 10px; background-color:rgb(182, 23, 23); color: #ffffff; border-radius: 4px; font-size: 24px; font-weight: bolder; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
              ${codigo}
            </p>
            <p style="font-size: 16px; color: #ffffff;">Este código expirará en 10 minutos.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mail);

    req.session.codigoVerificacion = codigo;
    req.session.emailVerificacion = email;
    req.session.intentosCodigo = 0;

    return res.status(200).json({
      status: 200,
      resp: "verification_required",
      message: "Código de verificación enviado al correo",
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({
      status: 500,
      error: err.message || "Error en el servidor",
    });
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
