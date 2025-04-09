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

const sendCarFormEmail = async (req, res, next) => {
  try {
    const { nombre, email, telefono, marca, modelo, año, kilometros, detalles } = req.body;

    if (!nombre || !email || !telefono || !marca || !modelo || !año || !kilometros) {
      return res.status(400).json({
        status: 400,
        error: "Todos los campos marcados como obligatorios son requeridos",
      });
    }

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Solicitud de compra de vehículo - ${marca} ${modelo}`,
      html: `
        <div style="width: 100%; background-color: #f5f5f5; padding: 20px; box-sizing: border-box;">
          <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #b61717; padding-bottom: 10px;">
              Solicitud de compra de vehículo
            </h2>
            
            <h3 style="color: #b61717; margin-top: 25px;">Información del cliente</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%; font-weight: bold;">Nombre completo:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono/Celular:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${telefono}</td>
              </tr>
            </table>
            
            <h3 style="color: #b61717; margin-top: 25px;">Información del vehículo</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%; font-weight: bold;">Marca:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${marca}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Modelo:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${modelo}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Año:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${año}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Kilómetros:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${kilometros} km</td>
              </tr>
              ${
                detalles
                  ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Detalles adicionales:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${detalles}</td>
              </tr>
              `
                  : ""
              }
            </table>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #b61717; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                Contactar al cliente
              </a>
            </div>
          </div>
        </div>
      `,
    };

    const clientMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: `Recibimos tu solicitud de venta - ${marca} ${modelo}`,
      html: `
        <div style="width: 100%; background-color: #f5f5f5; padding: 20px; box-sizing: border-box;">
          <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h2 style="color: #b61717;">¡Gracias por contactarnos, ${nombre}!</h2>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hemos recibido tu solicitud para vender tu ${marca} ${modelo} ${año} y nos pondremos en contacto contigo a la brevedad.
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Uno de nuestros asesores se comunicará contigo en las próximas 24 horas hábiles al número ${telefono} o al correo electrónico proporcionado.
            </p>
            <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
              <h3 style="color: #333; margin-top: 0;">Resumen de tu solicitud</h3>
              <p style="margin: 5px 0;"><strong>Vehículo:</strong> ${marca} ${modelo} ${año}</p>
              <p style="margin: 5px 0;"><strong>Kilómetros:</strong> ${kilometros} km</p>
              ${detalles ? `<p style="margin: 5px 0;"><strong>Detalles:</strong> ${detalles}</p>` : ""}
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(clientMailOptions);

    if (next) {
      next();
    } else {
      return res.status(200).json({
        status: 200,
        message: "Solicitud recibida correctamente. Te hemos enviado un email de confirmación.",
      });
    }
  } catch (error) {
    console.error("Error al enviar el email:", error);
    if (next) {
      next(error);
    } else {
      return res.status(500).json({
        status: 500,
        error: "Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.",
      });
    }
  }
};

module.exports = sendCarFormEmail;
