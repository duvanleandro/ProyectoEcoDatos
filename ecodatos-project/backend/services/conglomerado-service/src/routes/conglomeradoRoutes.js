const express = require('express');
const router = express.Router();
const conglomeradoController = require('../controllers/conglomeradoController');

// POST /api/conglomerados/generar - Generar conglomerados aleatorios
router.post('/generar', conglomeradoController.generar);

// GET /api/conglomerados/estadisticas - Obtener estadísticas
router.get('/estadisticas', conglomeradoController.estadisticas);

// GET /api/conglomerados - Listar todos (con filtros opcionales)
router.get('/', conglomeradoController.listar);

// GET /api/conglomerados/:id - Obtener uno específico con subparcelas
router.get('/:id', conglomeradoController.obtenerPorId);

// PUT /api/conglomerados/:id/aprobar - Aprobar conglomerado
router.put('/:id/aprobar', conglomeradoController.aprobar);

// PUT /api/conglomerados/:id/rechazar - Rechazar conglomerado
router.put('/:id/rechazar', conglomeradoController.rechazar);

module.exports = router;
