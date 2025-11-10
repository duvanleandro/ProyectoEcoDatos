const express = require('express');
const router = express.Router();
const conglomeradoController = require('../controllers/conglomeradoController');
const { verificarToken, esAdmin, esCoordinadorOAdmin } = require('../middleware/authMiddleware');

// Rutas protegidas
router.post('/generar', verificarToken, esCoordinadorOAdmin, conglomeradoController.generar);
router.get('/', verificarToken, conglomeradoController.listar);
router.get('/estadisticas', verificarToken, conglomeradoController.estadisticas);
router.get('/brigada/:brigadaId/activo', verificarToken, conglomeradoController.obtenerActivoPorBrigada);
router.get('/:id', verificarToken, conglomeradoController.obtenerPorId);
router.put('/:id/aprobar', verificarToken, esCoordinadorOAdmin, conglomeradoController.aprobar);
router.put('/:id/rechazar', verificarToken, esCoordinadorOAdmin, conglomeradoController.rechazar);
router.put('/:id/estado', verificarToken, conglomeradoController.cambiarEstado);
router.delete('/:id', verificarToken, esAdmin, conglomeradoController.eliminar);

module.exports = router;
