const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cors = require("cors");
const session = require("express-session"); // Añade esta línea
require("dotenv").config();

require("./db.js");

const server = express();

server.name = "API";

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true en producción (HTTPS)
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30 minutos de vida de la sesión
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

server.disable("etag");

// Middleware para agregar encabezado Cache-Control
server.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Configuración CORS actualizada para soportar sesiones
server.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Reemplaza con tu URL frontend
    credentials: true, // Permite enviar cookies
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  }),
);

// Elimina este middleware ya que CORS ahora está configurado arriba
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Cambia * por tu URL frontend
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

server.use("/", routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
