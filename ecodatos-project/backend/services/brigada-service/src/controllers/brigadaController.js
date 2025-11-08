const brigadaService = require('../services/brigadaService');

class BrigadaController {
  /**
   * POST /api/brigadas
   */
  async crear(req, res) {
    try {
      const brigada = await brigadaService.crearBrigada(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Brigada creada exitosamente. Asigna integrantes para activarla.',
        data: brigada
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/brigadas
   */
  async listar(req, res) {
    try {
      const { activo } = req.query;
      const filtros = {};
      
      if (activo !== undefined) {
        filtros.activo = activo === 'true';
      }
      
      const brigadas = await brigadaService.obtenerTodas(filtros);
      
      res.status(200).json({
        success: true,
        data: brigadas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/brigadas/:id
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const brigada = await brigadaService.obtenerPorId(id);
      
      res.status(200).json({
        success: true,
        data: brigada
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/brigadas/:id
   */
  async eliminarBrigada(req, res) {
    try {
      const { id } = req.params;
      const resultado = await brigadaService.eliminarBrigada(id);
      
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
   * POST /api/brigadas/:id/asignar-conglomerado
   */
  async asignarConglomerado(req, res) {
    try {
      const { id } = req.params;
      const { id_conglomerado } = req.body;
      
      const asignacion = await brigadaService.asignarConglomerado(
        parseInt(id), 
        parseInt(id_conglomerado)
      );
      
      res.status(201).json({
        success: true,
        message: 'Conglomerado asignado exitosamente',
        data: asignacion
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/brigadas/:id/conglomerados
   */
  async obtenerConglomerados(req, res) {
    try {
      const { id } = req.params;
      const conglomerados = await brigadaService.obtenerConglomeradosAsignados(id);
      
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
   * DELETE /api/brigadas/:id/asignar-conglomerado/:id_conglomerado
   */
  async eliminarAsignacion(req, res) {
    try {
      const { id, id_conglomerado } = req.params;
      const resultado = await brigadaService.eliminarAsignacion(
        parseInt(id),
        parseInt(id_conglomerado)
      );
      
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
   * POST /api/brigadas/integrantes
   */
  async crearIntegrante(req, res) {
    try {
      const integrante = await brigadaService.crearIntegrante(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Integrante creado exitosamente',
        data: integrante
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/brigadas/integrantes
   */
  async listarIntegrantes(req, res) {
    try {
      const integrantes = await brigadaService.obtenerIntegrantes();
      
      res.status(200).json({
        success: true,
        data: integrantes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/brigadas/:id/integrantes
   */
  async agregarIntegrante(req, res) {
    try {
      const { id } = req.params;
      const { id_integrante } = req.body;
      
      const resultado = await brigadaService.agregarIntegrante(
        parseInt(id),
        parseInt(id_integrante)
      );
      
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
   * POST /api/brigadas/:id/asignar-integrantes (múltiples)
   */
  async asignarIntegrantes(req, res) {
    try {
      const { id } = req.params;
      const { integrantes } = req.body;
      
      const resultado = await brigadaService.asignarIntegrantes(
        parseInt(id),
        integrantes
      );
      
      res.status(200).json({
        success: true,
        message: resultado.message,
        data: { brigada_activa: resultado.brigada_activa }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/brigadas/estadisticas
   */
  async estadisticas(req, res) {
    try {
      const stats = await brigadaService.obtenerEstadisticas();
      
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
   * GET /api/brigadas/usuario/:idUsuario
   */
  async obtenerPorUsuario(req, res) {
    try {
      const { idUsuario } = req.params;
      const brigada = await brigadaService.obtenerBrigadaPorUsuario(idUsuario);
      
      if (!brigada) {
        return res.status(404).json({
          success: false,
          message: 'El usuario no pertenece a ninguna brigada'
        });
      }

      res.status(200).json({
        success: true,
        data: brigada
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BrigadaController();
