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

// Configuración del almacén de sesiones
const sessionStore = new SequelizeStore({
  db: conn,
  tableName: "sessions",
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutos
  expiration: 24 * 60 * 60 * 1000, // 1 día
});

// Sincronización del almacén de sesiones
(async () => {
  try {
    await sessionStore.sync();
    console.log("Session store synced successfully");
  } catch (err) {
    console.error("Session store sync failed:", err);
  }
})();

// Configuración de sesión
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Importante para producción detrás de proxy
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? new URL(process.env.FRONTEND_URL).hostname.replace("www.", "")
          : undefined,
    },
  }),
);

// Configuración de seguridad y middlewares
server.disable("etag");
server.disable("x-powered-by");

server.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Configuración CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || process.env.NODE_ENV !== "production" || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));

// Rutas
server.use("/", routes);

// Manejador de errores
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
});

module.exports = server;
