const observacionService = require('../services/observacionService');

class ObservacionController {
  /**
   * Crear nueva observación
   */
  async crear(req, res) {
    try {
      const observacion = await observacionService.crearObservacion(req.body);
      res.status(201).json({
        success: true,
        message: 'Observación creada exitosamente',
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtener todas las observaciones
   */
  async obtenerTodas(req, res) {
    try {
      const filtros = {
        id_conglomerado: req.query.id_conglomerado,
        id_subparcela: req.query.id_subparcela,
        id_brigada: req.query.id_brigada,
        validado: req.query.validado
      };
      
      const observaciones = await observacionService.obtenerTodas(filtros);
      res.json({
        success: true,
        data: observaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtener observaciones por conglomerado
   */
  async obtenerPorConglomerado(req, res) {
    try {
      const { idConglomerado } = req.params;
      const observaciones = await observacionService.obtenerPorConglomerado(idConglomerado);
      res.json({
        success: true,
        data: observaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtener observaciones por subparcela
   */
  async obtenerPorSubparcela(req, res) {
    try {
      const { idSubparcela } = req.params;
      const observaciones = await observacionService.obtenerPorSubparcela(idSubparcela);
      res.json({
        success: true,
        data: observaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtener observaciones por brigada
   */
  async obtenerPorBrigada(req, res) {
    try {
      const { idBrigada } = req.params;
      const observaciones = await observacionService.obtenerPorBrigada(idBrigada);
      res.json({
        success: true,
        data: observaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtener observación por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const observacion = await observacionService.obtenerPorId(id);
      res.json({
        success: true,
        data: observacion
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Actualizar observación
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const observacion = await observacionService.actualizarObservacion(id, req.body);
      res.json({
        success: true,
        message: 'Observación actualizada exitosamente',
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Validar observación
   */
  async validar(req, res) {
    try {
      const { id } = req.params;
      const { idUsuario } = req.body;
      const observacion = await observacionService.validarObservacion(id, idUsuario);
      res.json({
        success: true,
        message: 'Observación validada exitosamente',
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Validar observación por jefe (enviar para revisión)
   */
  async validarPorJefe(req, res) {
    try {
      const { id } = req.params;
      const { idJefe } = req.body;
      const observacion = await observacionService.validarPorJefe(id, idJefe);
      res.json({
        success: true,
        message: 'Observación enviada para revisión exitosamente',
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Validación final por admin/coordinador
   */
  async validarPorAdmin(req, res) {
    try {
      const { id } = req.params;
      const { idUsuario } = req.body;
      const observacion = await observacionService.validarPorAdmin(id, idUsuario);
      res.json({
        success: true,
        message: 'Observación validada y cerrada exitosamente',
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Eliminar observación
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await observacionService.eliminarObservacion(id);
      res.json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas
   */
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await observacionService.obtenerEstadisticas();
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Subir fotos a observación
   */
  async subirFotos(req, res) {
    try {
      const { id } = req.params;
      const archivos = req.files;
      
      if (!archivos || archivos.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se enviaron archivos'
        });
      }

      const observacion = await observacionService.agregarFotos(id, archivos);
      
      res.json({
        success: true,
        message: `${archivos.length} foto(s) agregada(s) exitosamente`,
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Eliminar foto de observación
   */
  async eliminarFoto(req, res) {
    try {
      const { id, nombreFoto } = req.params;
      const observacion = await observacionService.eliminarFoto(id, nombreFoto);
      
      res.json({
        success: true,
        message: 'Foto eliminada exitosamente',
        data: observacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ObservacionController();
