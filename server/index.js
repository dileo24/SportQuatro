const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { fnCategorias, fnAutos, fnAdmin } = require("./src/loadDB.js");

conn.sync({ force: true }).then(async () => {
  server.listen(3001, async () => {
    await fnCategorias();
    await fnAutos();
    await fnAdmin();
    console.log("%s listening at 3001");
  });
});
