const express = require('express');
const router = express.Router();
const especieController = require('../controllers/especieController');

// Estadísticas
router.get('/estadisticas', especieController.estadisticas);

// CRUD
router.post('/', especieController.crear);
router.get('/', especieController.listar);
router.get('/:id', especieController.obtenerPorId);
router.put('/:id', especieController.actualizar);
router.delete('/:id', especieController.eliminar);

module.exports = router;
