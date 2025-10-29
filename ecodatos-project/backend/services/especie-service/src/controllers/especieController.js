const especieService = require('../services/especieService');

class EspecieController {
  /**
   * POST /api/especies
   */
  async crear(req, res) {
    try {
      const especie = await especieService.crearEspecie(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Especie creada exitosamente',
        data: especie
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/especies
   */
  async listar(req, res) {
    try {
      const { busqueda, familia } = req.query;
      const filtros = {};
      
      if (busqueda) filtros.busqueda = busqueda;
      if (familia) filtros.familia = familia;
      
      const especies = await especieService.obtenerTodas(filtros);
      
      res.status(200).json({
        success: true,
        data: especies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/especies/:id
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const especie = await especieService.obtenerPorId(id);
      
      res.status(200).json({
        success: true,
        data: especie
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/especies/:id
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const especie = await especieService.actualizarEspecie(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Especie actualizada exitosamente',
        data: especie
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/especies/:id
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await especieService.eliminarEspecie(id);
      
      res.status(200).json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/especies/estadisticas
   */
  async estadisticas(req, res) {
    try {
      const stats = await especieService.obtenerEstadisticas();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new EspecieController();
