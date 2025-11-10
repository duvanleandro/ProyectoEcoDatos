const express = require('express');
const router = express.Router();
const brigadaController = require('../controllers/brigadaController');
const { verificarToken, esAdmin, esCoordinadorOAdmin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
// Estadísticas
router.get('/estadisticas', verificarToken, brigadaController.estadisticas);

// Integrantes (solo admin puede crear y listar todos)
router.post('/integrantes', verificarToken, esAdmin, brigadaController.crearIntegrante);
router.get('/integrantes', verificarToken, brigadaController.listarIntegrantes);

// Brigadas
router.post('/', verificarToken, esCoordinadorOAdmin, brigadaController.crear);
router.get('/', verificarToken, brigadaController.listar);
router.get('/usuario/:idUsuario', verificarToken, brigadaController.obtenerPorUsuario);
router.get('/:id', verificarToken, brigadaController.obtenerPorId);
router.delete('/:id', verificarToken, esAdmin, brigadaController.eliminarBrigada);

// Asignar múltiples integrantes (solo coordinador o admin)
router.post('/:id/asignar-integrantes', verificarToken, esCoordinadorOAdmin, brigadaController.asignarIntegrantes);

// Asignaciones de conglomerados
router.post('/:id/asignar-conglomerado', verificarToken, esCoordinadorOAdmin, brigadaController.asignarConglomerado);
router.get('/:id/conglomerados', verificarToken, brigadaController.obtenerConglomerados);
router.delete('/:id/asignar-conglomerado/:id_conglomerado', verificarToken, esCoordinadorOAdmin, brigadaController.eliminarAsignacion);

// Agregar integrante a brigada (individual)
router.post('/:id/integrantes', verificarToken, esCoordinadorOAdmin, brigadaController.agregarIntegrante);

module.exports = router;
