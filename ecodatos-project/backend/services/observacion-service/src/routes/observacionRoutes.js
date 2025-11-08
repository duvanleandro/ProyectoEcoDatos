const express = require('express');
const router = express.Router();
const observacionController = require('../controllers/observacionController');

// Crear nueva observación
router.post('/', observacionController.crear);

// Obtener todas las observaciones (con filtros opcionales)
router.get('/', observacionController.obtenerTodas);

// Obtener estadísticas
router.get('/estadisticas', observacionController.obtenerEstadisticas);

// Obtener observaciones por conglomerado
router.get('/conglomerado/:idConglomerado', observacionController.obtenerPorConglomerado);

// Obtener observaciones por subparcela
router.get('/subparcela/:idSubparcela', observacionController.obtenerPorSubparcela);

// Obtener observaciones por brigada
router.get('/brigada/:idBrigada', observacionController.obtenerPorBrigada);

// Obtener observación por ID
router.get('/:id', observacionController.obtenerPorId);

// Actualizar observación
router.put('/:id', observacionController.actualizar);

// Validar por jefe de brigada (enviar para revisión)
router.put('/:id/validar-jefe', observacionController.validarPorJefe);

// Validar por admin/coordinador (validación final)
router.put('/:id/validar-admin', observacionController.validarPorAdmin);

// Eliminar observación
router.delete('/:id', observacionController.eliminar);

module.exports = router;
