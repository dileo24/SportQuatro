const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
require("dotenv").config();

const { conn } = require("./db.js");

const server = express();
server.name = "API";

const sessionStore = new SequelizeStore({
  db: conn,
  tableName: "sessions",
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

// Configuración de sesión
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS en producción
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30 minutos
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

if (process.env.NODE_ENV !== "production") {
  sessionStore.sync();
}

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
    origin: true,
    credentials: true,
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
