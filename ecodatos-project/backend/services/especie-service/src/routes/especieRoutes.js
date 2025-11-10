const express = require('express');
const router = express.Router();
const especieController = require('../controllers/especieController');
const { verificarToken, esAdmin, esCoordinadorOAdmin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
// Estadísticas
router.get('/estadisticas', verificarToken, especieController.estadisticas);

// CRUD
router.post('/', verificarToken, esCoordinadorOAdmin, especieController.crear);
router.get('/', verificarToken, especieController.listar);
router.get('/:id', verificarToken, especieController.obtenerPorId);
router.put('/:id', verificarToken, esCoordinadorOAdmin, especieController.actualizar);
router.delete('/:id', verificarToken, esAdmin, especieController.eliminar);

module.exports = router;
