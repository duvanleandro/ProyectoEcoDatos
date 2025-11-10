const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');
const { loginLimiter, generalLimiter } = require('../middleware/rateLimiter');
const { validarLogin, validarRegistro, validarCrearUsuario, validarEditarUsuario } = require('../middleware/validationMiddleware');

// Autenticación (rutas públicas)
router.post('/register', validarRegistro, authController.register);
router.post('/login', validarLogin, authController.login);

// Verificación de token (protegida)
router.get('/verify', verificarToken, authController.verificar);

// Gestión de usuarios (solo admin - protegidas)
router.post('/crear-usuario', verificarToken, esAdmin, validarCrearUsuario, authController.crearUsuario);
router.get('/usuarios', verificarToken, esAdmin, authController.listarUsuarios);
router.put('/usuarios/:id', verificarToken, esAdmin, validarEditarUsuario, authController.editarUsuario);
router.patch('/usuarios/:id/toggle-activo', verificarToken, esAdmin, authController.toggleActivarUsuario);
router.delete('/usuarios/:id', verificarToken, esAdmin, authController.eliminarUsuario);

// Estadísticas (protegida - cualquier usuario autenticado)
router.get('/estadisticas', verificarToken, authController.estadisticas);

// Perfil y gestión de contraseña (protegidas)
router.get('/perfil', verificarToken, authController.obtenerPerfil);
router.post('/cambiar-contrasena', verificarToken, authController.cambiarContrasena);
router.post('/restablecer-contrasena/:id', verificarToken, esAdmin, authController.restablecerContrasena);

// Logs de auditoría (solo admin)
router.get('/logs', verificarToken, esAdmin, authController.obtenerLogs);
router.get('/logs/estadisticas', verificarToken, esAdmin, authController.obtenerEstadisticasLogs);

module.exports = router;
