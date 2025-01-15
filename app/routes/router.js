const express = require("express");
const router = express.Router();
const controller = require("../controller/Controller.js");

router.get("/", controller.renderCadastroPage);
router.get("/login", controller.renderLoginPage);
router.post("/cadastro", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/logout", controller.logoutUser);
router.get("/inicial", controller.renderInicialPage);
router.post("/updateusername", controller.updateUsername);
router.post("/updatenovasenha", controller.updatePassword);

module.exports = router;
