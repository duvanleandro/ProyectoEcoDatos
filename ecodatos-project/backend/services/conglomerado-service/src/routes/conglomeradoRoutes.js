const express = require('express');
const router = express.Router();
const conglomeradoController = require('../controllers/conglomeradoController');

// Rutas
router.post('/generar', conglomeradoController.generar);
router.get('/', conglomeradoController.listar);
router.get('/estadisticas', conglomeradoController.estadisticas);
router.get('/:id', conglomeradoController.obtenerPorId);
router.put('/:id/aprobar', conglomeradoController.aprobar);
router.put('/:id/rechazar', conglomeradoController.rechazar);
router.put('/:id/estado', conglomeradoController.cambiarEstado);
router.delete('/:id', conglomeradoController.eliminar);

module.exports = router;
