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
router.get('/:id', brigadaController.obtenerPorId);

// Asignaciones
router.post('/:id/asignar-conglomerado', brigadaController.asignarConglomerado);
router.get('/:id/conglomerados', brigadaController.obtenerConglomerados);

// Agregar integrante a brigada
router.post('/:id/integrantes', brigadaController.agregarIntegrante);

module.exports = router;
