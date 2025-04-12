const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cors = require("cors");
// const session = require("express-session"); // Comentado para implementación futura
require("dotenv").config();

require("./db.js");

const server = express();

server.name = "API";

// Configuración de sesión comentada para implementación futura
/*
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
*/

server.disable("etag");

server.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

server.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true, // Esto podría comentarse también si no se usan sesiones
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  }),
);

server.use("/", routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
