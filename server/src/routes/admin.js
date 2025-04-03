const express = require("express");
const router = express.Router();
const login = require("../middlewares/admin/login");
const verifyCodeController = require("../middlewares/admin/verifyCode");

router.post("/login", login);
router.post("/verify-code", verifyCodeController);
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Sesión cerrada" });
  });
});

module.exports = router;
