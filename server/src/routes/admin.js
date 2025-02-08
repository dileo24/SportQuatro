const { Router } = require("express");
const login = require("../middlewares/admin/login");

const router = Router();

router.post("/login", login, async (req, res) => {
  return res.send(req.body);
});

module.exports = router;
