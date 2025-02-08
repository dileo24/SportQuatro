const { Auto, Categoria } = require("../../db");

const allAutos = async (req, res, next) => {
  try {
    const allAutos = await Auto.findAll({
      include: [{ model: Categoria, as: "categ" }],
      order: [["precio", "ASC"]],
    });

    req.body = {
      status: 200,
      resp: allAutos,
    };
    next();
  } catch (err) {
    console.log("error en allAutos", err);
    res.status(404);
  }
};

module.exports = allAutos;
