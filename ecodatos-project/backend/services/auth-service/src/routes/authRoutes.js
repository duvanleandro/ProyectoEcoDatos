const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verificar);

// Gestión de usuarios (solo admin)
router.post('/crear-usuario', authController.crearUsuario);
router.get('/usuarios', authController.listarUsuarios);
router.delete('/usuarios/:id', authController.eliminarUsuario);

module.exports = router;
