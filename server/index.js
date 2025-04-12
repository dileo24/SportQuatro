const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { fnCategorias, fnAutos, fnAdmin } = require("./src/loadDB.js");
const { Categoria, Admin } = require("./src/db.js");

conn.sync({ alter: true }).then(async () => {
  server.listen(3001, async () => {
    if ((await Categoria.count()) === 0) {
      await fnCategorias();
      //await fnAutos();
    }
    if ((await Admin.count()) === 0) {
      await fnAdmin();
    }
    console.log("Server listening at 3001");
  });
});
