const express = require('express');
const router = express.Router();
const observacionController = require('../controllers/observacionController');
const upload = require('../middleware/upload');
const { verificarToken, esAdmin, esCoordinadorOAdmin, esJefeBrigada } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
// Crear nueva observación (cualquier usuario autenticado)
router.post('/', verificarToken, observacionController.crear);

// Obtener todas las observaciones (con filtros opcionales)
router.get('/', verificarToken, observacionController.obtenerTodas);

// Obtener estadísticas
router.get('/estadisticas', verificarToken, observacionController.obtenerEstadisticas);

// Obtener observaciones por conglomerado
router.get('/conglomerado/:idConglomerado', verificarToken, observacionController.obtenerPorConglomerado);

// Obtener observaciones por subparcela
router.get('/subparcela/:idSubparcela', verificarToken, observacionController.obtenerPorSubparcela);

// Obtener observaciones por brigada
router.get('/brigada/:idBrigada', verificarToken, observacionController.obtenerPorBrigada);

// Obtener observación por ID
router.get('/:id', verificarToken, observacionController.obtenerPorId);

// Actualizar observación (solo quien la creó o admin)
router.put('/:id', verificarToken, observacionController.actualizar);

// Validar por jefe de brigada (enviar para revisión)
router.put('/:id/validar-jefe', verificarToken, esJefeBrigada, observacionController.validarPorJefe);

// Validar por admin/coordinador (validación final)
router.put('/:id/validar-admin', verificarToken, esCoordinadorOAdmin, observacionController.validarPorAdmin);

// Eliminar observación (solo admin)
router.delete('/:id', verificarToken, esAdmin, observacionController.eliminar);

// Subir fotos (cualquier usuario autenticado)
router.post('/:id/fotos', verificarToken, upload.array('fotos', 10), observacionController.subirFotos);

// Eliminar foto (solo admin o quien subió)
router.delete('/:id/fotos/:nombreFoto', verificarToken, observacionController.eliminarFoto);

module.exports = router;
