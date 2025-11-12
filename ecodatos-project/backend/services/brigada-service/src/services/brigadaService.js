const Brigada = require('../models/Brigada');
const Integrante = require('../models/Integrante');
const BrigadaConglomerado = require('../models/BrigadaConglomerado');
const { sequelize } = require('../config/database');

class BrigadaService {
  /**
   * Validar composición de brigada y actualizar estado
   */
  async validarYActualizarEstado(id_brigada) {
    try {
      // Obtener integrantes de la brigada
      const integrantes = await sequelize.query(`
        SELECT i.rol
        FROM integrante i
        INNER JOIN brigadaintegrante bi ON i.id = bi.id_integrante
        WHERE bi.id_brigada = :id_brigada
      `, {
        replacements: { id_brigada },
        type: sequelize.QueryTypes.SELECT
      });

      // Contar por rol
      const jefes = integrantes.filter(i => i.rol === 'jefe_brigada').length;
      const botanicos = integrantes.filter(i => i.rol === 'botanico').length;
      const tecnicos = integrantes.filter(i => i.rol === 'tecnico_auxiliar').length;
      const coinvestigadores = integrantes.filter(i => i.rol === 'coinvestigador').length;

      // Validar composición
      const esValida = jefes === 1 && botanicos >= 1 && tecnicos >= 1 && coinvestigadores >= 1;

      // Actualizar estado de la brigada
      await sequelize.query(`
        UPDATE brigada
        SET activo = :activo
        WHERE id = :id_brigada
      `, {
        replacements: { activo: esValida, id_brigada },
        type: sequelize.QueryTypes.UPDATE
      });

      return esValida;
    } catch (error) {
      console.error('Error al validar composición:', error);
      return false;
    }
  }

  /**
   * Crear una nueva brigada
   */
  async crearBrigada(data) {
    try {
      const brigada = await Brigada.create({
        nombre: data.nombre,
        zona_designada: data.zona_designada || null,
        activo: false
      });
      
      return brigada;
    } catch (error) {
      throw new Error('Error al crear brigada: ' + error.message);
    }
  }

  /**
   * Obtener todas las brigadas
   */
  async obtenerTodas(filtros = {}) {
    try {
      const where = {};
      
      if (filtros.activo !== undefined) {
        where.activo = filtros.activo;
      }
      
      const brigadas = await Brigada.findAll({
        where,
        order: [['id', 'DESC']]
      });
      
      return brigadas;
    } catch (error) {
      throw new Error('Error al obtener brigadas: ' + error.message);
    }
  }

  /**
   * Obtener brigada por ID con sus integrantes
   */
  async obtenerPorId(id) {
    try {
      const brigada = await Brigada.findByPk(id);
      
      if (!brigada) {
        throw new Error('Brigada no encontrada');
      }
      
      const integrantes = await sequelize.query(`
        SELECT i.* 
        FROM integrante i
        INNER JOIN brigadaintegrante bi ON i.id = bi.id_integrante
        WHERE bi.id_brigada = :id_brigada
      `, {
        replacements: { id_brigada: id },
        type: sequelize.QueryTypes.SELECT
      });
      
      return {
        ...brigada.toJSON(),
        integrantes
      };
    } catch (error) {
      throw new Error('Error al obtener brigada: ' + error.message);
    }
  }

  /**
   * Eliminar brigada
   */
  async eliminarBrigada(id) {
    try {
      const brigada = await Brigada.findByPk(id);
      if (!brigada) {
        throw new Error('Brigada no encontrada');
      }

      await brigada.destroy();
      return { message: 'Brigada eliminada exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar brigada: ' + error.message);
    }
  }

  /**
   * Asignar brigada a conglomerado
   */
  async asignarConglomerado(id_brigada, id_conglomerado) {
    try {
      // Verificar que la brigada esté activa
      const brigada = await Brigada.findByPk(id_brigada);
      if (!brigada || !brigada.activo) {
        throw new Error('La brigada debe estar activa (con todos sus integrantes asignados) para poder asignar conglomerados');
      }

      // Verificar si ya existe la asignación
      const existente = await BrigadaConglomerado.findOne({
        where: { id_brigada, id_conglomerado }
      });
      
      if (existente) {
        throw new Error('Este conglomerado ya está asignado a esta brigada');
      }
      
      // Crear asignación
      const asignacion = await BrigadaConglomerado.create({
        id_brigada,
        id_conglomerado,
        estado: 'Pendiente'
      });
      
      // CORREGIDO: Actualizar TODAS las columnas del conglomerado
      await sequelize.query(`
        UPDATE conglomerado 
        SET estado = 'Asignado',
            brigada_id = :id_brigada,
            brigada_nombre = :brigada_nombre,
            fecha_asignacion = NOW()
        WHERE id = :id_conglomerado AND estado = 'Aprobado'
      `, {
        replacements: { 
          id_conglomerado,
          id_brigada,
          brigada_nombre: brigada.nombre
        },
        type: sequelize.QueryTypes.UPDATE
      });
      
      return asignacion;
    } catch (error) {
      throw new Error('Error al asignar conglomerado: ' + error.message);
    }
  }

  /**
   * Obtener conglomerados asignados a una brigada
   */
  async obtenerConglomeradosAsignados(id_brigada) {
    try {
      const conglomerados = await sequelize.query(`
        SELECT 
          c.*,
          bc.fecha_asignacion,
          c.estado as estado_real, bc.estado as estado_asignacion
        FROM conglomerado c
        INNER JOIN brigadaconglomerado bc ON c.id = bc.id_conglomerado
        WHERE bc.id_brigada = :id_brigada
        ORDER BY bc.fecha_asignacion DESC
      `, {
        replacements: { id_brigada },
        type: sequelize.QueryTypes.SELECT
      });
      
      return conglomerados;
    } catch (error) {
      throw new Error('Error al obtener conglomerados asignados: ' + error.message);
    }
  }

  /**
   * Eliminar asignación de conglomerado
   */
  async eliminarAsignacion(id_brigada, id_conglomerado) {
    try {
      await BrigadaConglomerado.destroy({
        where: { id_brigada, id_conglomerado }
      });
      
      // Volver el conglomerado a estado "Aprobado"
      await sequelize.query(`
        UPDATE conglomerado 
        SET estado = 'Aprobado',
            brigada_id = NULL,
            brigada_nombre = NULL,
            fecha_asignacion = NULL
        WHERE id = :id_conglomerado
      `, {
        replacements: { id_conglomerado },
        type: sequelize.QueryTypes.UPDATE
      });
      
      return { message: 'Asignación eliminada exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar asignación: ' + error.message);
    }
  }

  /**
   * Crear integrante
   */
  async crearIntegrante(data) {
    try {
      const integrante = await Integrante.create({
        nombre_apellidos: data.nombre_apellidos,
        rol: data.rol,
        telefono: data.telefono || null,
        email: data.email || null,
        especialidad: data.especialidad || null
      });
      
      return integrante;
    } catch (error) {
      throw new Error('Error al crear integrante: ' + error.message);
    }
  }

  /**
   * Obtener todos los integrantes que tengan usuario activo
   */
  async obtenerIntegrantes() {
    try {
      // Solo traer integrantes que tengan un usuario asociado y que esté activo
      const integrantes = await sequelize.query(`
        SELECT i.*
        FROM integrante i
        INNER JOIN usuarios u ON i.id = u.id_integrante
        WHERE u.activo = true
        ORDER BY i.nombre_apellidos ASC
      `, {
        type: sequelize.QueryTypes.SELECT
      });

      return integrantes;
    } catch (error) {
      throw new Error('Error al obtener integrantes: ' + error.message);
    }
  }

  /**
   * Agregar integrante a brigada
   */
  async agregarIntegrante(id_brigada, id_integrante) {
    try {
      await sequelize.query(`
        DELETE FROM brigadaintegrante
        WHERE id_brigada = :id_brigada
      `, {
        replacements: { id_brigada },
        type: sequelize.QueryTypes.DELETE
      });

      await sequelize.query(`
        INSERT INTO brigadaintegrante (id_brigada, id_integrante)
        VALUES (:id_brigada, :id_integrante)
        ON CONFLICT DO NOTHING
      `, {
        replacements: { id_brigada, id_integrante },
        type: sequelize.QueryTypes.INSERT
      });
      
      await this.validarYActualizarEstado(id_brigada);
      
      return { message: 'Integrante agregado a la brigada' };
    } catch (error) {
      throw new Error('Error al agregar integrante: ' + error.message);
    }
  }

  /**
   * Asignar múltiples integrantes a brigada
   */
  async asignarIntegrantes(id_brigada, integrantes_ids) {
    try {
      await sequelize.query(`
        DELETE FROM brigadaintegrante
        WHERE id_brigada = :id_brigada
      `, {
        replacements: { id_brigada },
        type: sequelize.QueryTypes.DELETE
      });

      for (const id_integrante of integrantes_ids) {
        await sequelize.query(`
          INSERT INTO brigadaintegrante (id_brigada, id_integrante)
          VALUES (:id_brigada, :id_integrante)
          ON CONFLICT DO NOTHING
        `, {
          replacements: { id_brigada, id_integrante },
          type: sequelize.QueryTypes.INSERT
        });
      }
      
      const esValida = await this.validarYActualizarEstado(id_brigada);
      
      return { 
        message: 'Integrantes asignados exitosamente',
        brigada_activa: esValida
      };
    } catch (error) {
      throw new Error('Error al asignar integrantes: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas
   */
  async obtenerEstadisticas() {
  try {
    const totalBrigadas = await Brigada.count();
    const brigadasActivas = await Brigada.count({ where: { activo: true } });
    const totalIntegrantes = await Integrante.count();
    
    const asignaciones = await sequelize.query(`
      SELECT estado, COUNT(*) as cantidad
      FROM brigadaconglomerado
      GROUP BY estado
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    
    const stats = {
      total: totalBrigadas,
      activas: brigadasActivas,
      total_integrantes: totalIntegrantes,
      asignaciones: {
        pendientes: 0,
        en_proceso: 0,
        completadas: 0
      }
    };
    
    asignaciones.forEach(a => {
      if (a.estado === 'Pendiente') stats.asignaciones.pendientes = parseInt(a.cantidad);
      if (a.estado === 'En_Proceso') stats.asignaciones.en_proceso = parseInt(a.cantidad);
      if (a.estado === 'Completado') stats.asignaciones.completadas = parseInt(a.cantidad);
    });
    
    return stats;
  } catch (error) {
    throw new Error('Error al obtener estadísticas: ' + error.message);
  }
}

   async obtenerBrigadaPorUsuario(idUsuario) {
    try {
      // Obtener TODAS las brigadas del usuario
      const brigadas = await sequelize.query(`
        SELECT DISTINCT b.*
        FROM brigada b
        INNER JOIN brigadaintegrante bi ON b.id = bi.id_brigada
        INNER JOIN integrante i ON bi.id_integrante = i.id
        INNER JOIN usuarios u ON i.id = u.id_integrante
        WHERE u.id = :idUsuario
        ORDER BY b.activo DESC, b.id DESC
      `, {
        replacements: { idUsuario },
        type: sequelize.QueryTypes.SELECT
      });

      if (brigadas.length === 0) {
        return null;
      }

      // Buscar la brigada que tiene un conglomerado en proceso
      let brigadaConConglomerado = null;
      for (const brigada of brigadas) {
        const conglomerado = await sequelize.query(`
          SELECT COUNT(*) as count
          FROM conglomerado c
          WHERE c.brigada_id = :brigada_id
          AND c.estado = 'En_Proceso'
          LIMIT 1
        `, {
          replacements: { brigada_id: brigada.id },
          type: sequelize.QueryTypes.SELECT
        });

        if (conglomerado[0].count > 0) {
          brigadaConConglomerado = brigada;
          break;
        }
      }

      // Si hay una brigada con conglomerado en proceso, usar esa; si no, usar la primera
      const brigadaSeleccionada = brigadaConConglomerado || brigadas[0];

      // Obtener todos los integrantes de la brigada seleccionada
      const integrantes = await sequelize.query(`
        SELECT i.id, i.nombre_apellidos, i.rol, i.especialidad, i.telefono, i.email
        FROM integrante i
        INNER JOIN brigadaintegrante bi ON i.id = bi.id_integrante
        WHERE bi.id_brigada = :id_brigada
        ORDER BY
          CASE i.rol
            WHEN 'jefe_brigada' THEN 1
            WHEN 'botanico' THEN 2
            WHEN 'tecnico_auxiliar' THEN 3
            WHEN 'coinvestigador' THEN 4
            ELSE 5
          END,
          i.nombre_apellidos ASC
      `, {
        replacements: { id_brigada: brigadaSeleccionada.id },
        type: sequelize.QueryTypes.SELECT
      });

      return {
        id: brigadaSeleccionada.id,
        nombre: brigadaSeleccionada.nombre,
        zona_designada: brigadaSeleccionada.zona_designada,
        activo: brigadaSeleccionada.activo,
        integrantes: integrantes,
        total_brigadas: brigadas.length
      };
    } catch (error) {
      throw new Error('Error al obtener brigada del usuario: ' + error.message);
    }
  }
}



module.exports = new BrigadaService();
