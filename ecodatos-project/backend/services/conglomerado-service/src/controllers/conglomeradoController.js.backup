const conglomeradoService = require('../services/conglomeradoService');

class ConglomeradoController {
  /**
   * POST /api/conglomerados/generar
   */
  async generar(req, res) {
    try {
      const { cantidad } = req.body;
      const cantidadGenerar = cantidad || 50;
      
      const conglomerados = await conglomeradoService.generarConglomerados(cantidadGenerar);
      
      res.status(201).json({
        success: true,
        message: `${conglomerados.length} conglomerados generados exitosamente`,
        data: conglomerados
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/conglomerados
   */
  async listar(req, res) {
    try {
      const { estado } = req.query;
      const filtros = {};
      
      if (estado) {
        filtros.estado = estado;
      }
      
      const conglomerados = await conglomeradoService.obtenerTodos(filtros);
      
      res.status(200).json({
        success: true,
        data: conglomerados
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/conglomerados/:id
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const conglomerado = await conglomeradoService.obtenerPorId(id);
      
      res.status(200).json({
        success: true,
        data: conglomerado
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/conglomerados/:id/aprobar
   */
  async aprobar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await conglomeradoService.aprobarConglomerado(id);
      
      res.status(200).json({
        success: true,
        message: 'Conglomerado aprobado y subparcelas creadas exitosamente',
        data: resultado
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/conglomerados/:id/rechazar
   */
  async rechazar(req, res) {
    try {
      const { id } = req.params;
      const conglomerado = await conglomeradoService.rechazarConglomerado(id);
      
      res.status(200).json({
        success: true,
        message: 'Conglomerado rechazado exitosamente',
        data: conglomerado
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/conglomerados/estadisticas
   */
  async estadisticas(req, res) {
    try {
      const stats = await conglomeradoService.obtenerEstadisticas();
      
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

  /**
   * DELETE /api/conglomerados/:id
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await conglomeradoService.eliminarConglomerado(id);
      
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
}

module.exports = new ConglomeradoController();
