const { sequelize } = require('../config/database');

/**
 * Middleware de auditoría para registrar acciones importantes
 */
class AuditLogger {
  /**
   * Registrar una acción en la base de datos
   */
  async log(usuarioId, accion, entidad, entidadId, detalles = null, ipAddress = null) {
    try {
      await sequelize.query(`
        INSERT INTO logs_auditoria (id_usuario, accion, entidad, id_entidad, detalles, ip_address)
        VALUES (:usuarioId, :accion, :entidad, :entidadId, :detalles, :ipAddress)
      `, {
        replacements: {
          usuarioId,
          accion,
          entidad,
          entidadId,
          detalles: detalles ? JSON.stringify(detalles) : null,
          ipAddress
        }
      });
    } catch (error) {
      // No fallar la operación principal si falla el log
      console.error('Error al registrar log de auditoría:', error.message);
    }
  }

  /**
   * Middleware Express para logging automático
   */
  middleware(accion, entidad) {
    return async (req, res, next) => {
      // Guardar la función original de res.json
      const originalJson = res.json.bind(res);

      // Sobrescribir res.json para capturar el resultado
      res.json = function(data) {
        // Solo loguear si la operación fue exitosa
        if (data.success) {
          const usuarioId = req.usuario?.id || null;
          const entidadId = req.params.id || data.data?.id || null;
          const ipAddress = req.ip || req.connection.remoteAddress;

          // Registrar de forma asíncrona sin bloquear la respuesta
          auditLogger.log(usuarioId, accion, entidad, entidadId, null, ipAddress)
            .catch(err => console.error('Error en audit log:', err));
        }

        // Llamar a la función original
        return originalJson(data);
      };

      next();
    };
  }

  /**
   * Obtener logs de auditoría con filtros
   */
  async obtenerLogs(filtros = {}) {
    const { usuarioId, accion, entidad, fechaInicio, fechaFin, limit = 100, offset = 0 } = filtros;

    let whereConditions = [];
    let replacements = { limit, offset };

    if (usuarioId) {
      whereConditions.push('la.id_usuario = :usuarioId');
      replacements.usuarioId = usuarioId;
    }

    if (accion) {
      whereConditions.push('la.accion = :accion');
      replacements.accion = accion;
    }

    if (entidad) {
      whereConditions.push('la.entidad = :entidad');
      replacements.entidad = entidad;
    }

    if (fechaInicio) {
      whereConditions.push('la.fecha >= :fechaInicio');
      replacements.fechaInicio = fechaInicio;
    }

    if (fechaFin) {
      whereConditions.push('la.fecha <= :fechaFin');
      replacements.fechaFin = fechaFin;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const [logs] = await sequelize.query(`
      SELECT
        la.id,
        la.id_usuario,
        u.usuario as nombre_usuario,
        la.accion,
        la.entidad,
        la.id_entidad,
        la.detalles,
        la.ip_address,
        la.fecha
      FROM logs_auditoria la
      LEFT JOIN usuarios u ON la.id_usuario = u.id
      ${whereClause}
      ORDER BY la.fecha DESC
      LIMIT :limit OFFSET :offset
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    return logs;
  }

  /**
   * Obtener estadísticas de auditoría
   */
  async obtenerEstadisticas() {
    const [stats] = await sequelize.query(`
      SELECT
        COUNT(*) as total_logs,
        COUNT(DISTINCT id_usuario) as usuarios_activos,
        COUNT(DISTINCT DATE(fecha)) as dias_con_actividad
      FROM logs_auditoria
      WHERE fecha >= NOW() - INTERVAL '30 days'
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    const [accionesPorTipo] = await sequelize.query(`
      SELECT
        accion,
        COUNT(*) as cantidad
      FROM logs_auditoria
      WHERE fecha >= NOW() - INTERVAL '30 days'
      GROUP BY accion
      ORDER BY cantidad DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    return {
      ...stats[0],
      accionesPorTipo
    };
  }
}

const auditLogger = new AuditLogger();

module.exports = auditLogger;
