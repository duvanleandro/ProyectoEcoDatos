const Observacion = require('../models/Observacion');

class ObservacionService {
  /**
   * Crear una nueva observación
   */
  async crearObservacion(datos) {
    try {
      const observacion = await Observacion.create(datos);
      return observacion;
    } catch (error) {
      throw new Error('Error al crear observación: ' + error.message);
    }
  }

  /**
   * Obtener todas las observaciones con filtros opcionales
   */
  async obtenerTodas(filtros = {}) {
    try {
      const where = {};
      
      if (filtros.id_conglomerado) {
        where.id_conglomerado = filtros.id_conglomerado;
      }
      
      if (filtros.id_subparcela) {
        where.id_subparcela = filtros.id_subparcela;
      }
      
      if (filtros.id_brigada) {
        where.id_brigada = filtros.id_brigada;
      }
      
      if (filtros.validado !== undefined) {
        where.validado = filtros.validado;
      }
      
      const observaciones = await Observacion.findAll({
        where,
        order: [['fecha_observacion', 'DESC']]
      });
      
      return observaciones;
    } catch (error) {
      throw new Error('Error al obtener observaciones: ' + error.message);
    }
  }

  /**
   * Obtener observaciones de un conglomerado específico
   */
  async obtenerPorConglomerado(idConglomerado) {
    try {
      const observaciones = await Observacion.findAll({
        where: { id_conglomerado: idConglomerado },
        order: [['fecha_observacion', 'DESC']]
      });
      
      return observaciones;
    } catch (error) {
      throw new Error('Error al obtener observaciones del conglomerado: ' + error.message);
    }
  }

  /**
   * Obtener observaciones de una subparcela específica
   */
  async obtenerPorSubparcela(idSubparcela) {
    try {
      const observaciones = await Observacion.findAll({
        where: { id_subparcela: idSubparcela },
        order: [['fecha_observacion', 'DESC']]
      });
      
      return observaciones;
    } catch (error) {
      throw new Error('Error al obtener observaciones de la subparcela: ' + error.message);
    }
  }

  /**
   * Obtener observaciones de una brigada específica
   */
  async obtenerPorBrigada(idBrigada) {
    try {
      const observaciones = await Observacion.findAll({
        where: { id_brigada: idBrigada },
        order: [['fecha_observacion', 'DESC']]
      });
      
      return observaciones;
    } catch (error) {
      throw new Error('Error al obtener observaciones de la brigada: ' + error.message);
    }
  }

  /**
   * Obtener una observación por ID
   */
  async obtenerPorId(id) {
    try {
      const observacion = await Observacion.findByPk(id);
      
      if (!observacion) {
        throw new Error('Observación no encontrada');
      }
      
      return observacion;
    } catch (error) {
      throw new Error('Error al obtener observación: ' + error.message);
    }
  }

  /**
   * Actualizar una observación
   */
  async actualizarObservacion(id, datos) {
    try {
      const observacion = await Observacion.findByPk(id);
      
      if (!observacion) {
        throw new Error('Observación no encontrada');
      }
      
      // Actualizar updated_at
      datos.updated_at = new Date();
      
      await observacion.update(datos);
      return observacion;
    } catch (error) {
      throw new Error('Error al actualizar observación: ' + error.message);
    }
  }

  /**
   * Validar una observación
   */
  async validarObservacion(id, idUsuarioValidador) {
    try {
      const observacion = await Observacion.findByPk(id);
      
      if (!observacion) {
        throw new Error('Observación no encontrada');
      }
      
      observacion.validado = true;
      observacion.validado_por = idUsuarioValidador;
      observacion.fecha_validacion = new Date();
      observacion.updated_at = new Date();
      
      await observacion.save();
      return observacion;
    } catch (error) {
      throw new Error('Error al validar observación: ' + error.message);
    }
  }

  /**
   * Validar observación por jefe de brigada (enviar para revisión)
   */
  async validarPorJefe(id, idJefeValidador) {
    try {
      const observacion = await Observacion.findByPk(id);
      
      if (!observacion) {
        throw new Error('Observación no encontrada');
      }

      if (observacion.validado_por_jefe) {
        throw new Error('Esta observación ya fue enviada para revisión');
      }
      
      observacion.validado_por_jefe = true;
      observacion.jefe_validador_id = idJefeValidador;
      observacion.fecha_validacion_jefe = new Date();
      observacion.updated_at = new Date();
      
      await observacion.save();
      return observacion;
    } catch (error) {
      throw new Error('Error al validar observación por jefe: ' + error.message);
    }
  }

  /**
   * Validación final por admin/coordinador
   */
  async validarPorAdmin(id, idUsuarioValidador) {
    try {
      const observacion = await Observacion.findByPk(id);
      
      if (!observacion) {
        throw new Error('Observación no encontrada');
      }

      if (!observacion.validado_por_jefe) {
        throw new Error('La observación debe ser validada primero por el jefe de brigada');
      }

      if (observacion.validado) {
        throw new Error('Esta observación ya fue validada');
      }
      
      observacion.validado = true;
      observacion.validado_por = idUsuarioValidador;
      observacion.fecha_validacion = new Date();
      observacion.updated_at = new Date();
      
      await observacion.save();
      return observacion;
    } catch (error) {
      throw new Error('Error al validar observación por admin: ' + error.message);
    }
  }

  /**
   * Eliminar una observación
   */
  async eliminarObservacion(id) {
    try {
      const observacion = await Observacion.findByPk(id);
      
      if (!observacion) {
        throw new Error('Observación no encontrada');
      }
      
      await observacion.destroy();
      return { message: 'Observación eliminada exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar observación: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas de observaciones
   */
  async obtenerEstadisticas() {
    try {
      const total = await Observacion.count();
      const validadas = await Observacion.count({ where: { validado: true } });
      const pendientes = await Observacion.count({ where: { validado: false } });
      
      return {
        total,
        validadas,
        pendientes
      };
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }
}

module.exports = new ObservacionService();
