const express = require('express');
const userController = require('../controller/userController.js');
const router = express.Router();

// Rotas de usuário
router.post('/cadastro', userController.register);
router.post('/updatepassword', userController.updatePassword);
router.post('/updateusername', userController.updateUsername);

// Rotas protegidas
router.get('/perfil', userController.getProfile);

module.exports = router;
