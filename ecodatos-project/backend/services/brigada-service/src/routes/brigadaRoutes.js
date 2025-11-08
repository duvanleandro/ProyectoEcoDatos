const express = require('express');
const router = express.Router();
const brigadaController = require('../controllers/brigadaController');

// Estadísticas
router.get('/estadisticas', brigadaController.estadisticas);

// Integrantes
router.post('/integrantes', brigadaController.crearIntegrante);
router.get('/integrantes', brigadaController.listarIntegrantes);

// Brigadas
router.post('/', brigadaController.crear);
router.get('/', brigadaController.listar);
router.get('/usuario/:idUsuario', brigadaController.obtenerPorUsuario);
router.get('/:id', brigadaController.obtenerPorId);
router.delete('/:id', brigadaController.eliminarBrigada);

// Asignar múltiples integrantes
router.post('/:id/asignar-integrantes', brigadaController.asignarIntegrantes);

// Asignaciones de conglomerados
router.post('/:id/asignar-conglomerado', brigadaController.asignarConglomerado);
router.get('/:id/conglomerados', brigadaController.obtenerConglomerados);
router.delete('/:id/asignar-conglomerado/:id_conglomerado', brigadaController.eliminarAsignacion);

// Agregar integrante a brigada (individual)
router.post('/:id/integrantes', brigadaController.agregarIntegrante);

module.exports = router;
