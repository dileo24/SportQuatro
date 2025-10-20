const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { fnCategorias, fnAutos, fnAdmin } = require("./src/loadDB.js");
const { Categoria, Admin } = require("./src/db.js");

const CATEGORIAS_ESPERADAS = [
  "SUV", "Pick Up", "5 Puertas", "4 Puertas", "3 Puertas", 
  "Utilitario", "Clásicos", "0km", "Moto"
];

conn.sync({ alter: true }).then(async () => {
  server.listen(3001, async () => {

    const categoriasExistentes = await Categoria.findAll({
      attributes: ['categ']
    });
    
    const nombresExistentes = categoriasExistentes.map(cat => cat.categ);
    const categoriasFaltantes = CATEGORIAS_ESPERADAS.filter(
      nombre => !nombresExistentes.includes(nombre)
    );

    if (categoriasFaltantes.length > 0) {
      await fnCategorias();
    }

   /*  if ((await Categoria.count()) === 0) {
      await fnCategorias();
      //await fnAutos();
    } */
    if ((await Admin.count()) === 0) {
      await fnAdmin();
    }
    console.log("Server listening at 3001");
  });
});
