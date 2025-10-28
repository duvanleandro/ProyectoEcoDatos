const Brigada = require('../models/Brigada');
const Integrante = require('../models/Integrante');
const BrigadaConglomerado = require('../models/BrigadaConglomerado');
const { sequelize } = require('../config/database');

class BrigadaService {
  /**
   * Crear una nueva brigada
   */
  async crearBrigada(data) {
    try {
      const brigada = await Brigada.create({
        nombre: data.nombre,
        zona_designada: data.zona_designada || null
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
      
      // Obtener integrantes de la brigada
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
   * Asignar brigada a conglomerado
   */
  async asignarConglomerado(id_brigada, id_conglomerado) {
    try {
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
      
      // Actualizar estado del conglomerado a "Asignado"
      await sequelize.query(`
        UPDATE conglomerado 
        SET estado = 'Asignado' 
        WHERE id = :id_conglomerado AND estado = 'Aprobado'
      `, {
        replacements: { id_conglomerado },
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
          bc.estado as estado_asignacion
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
   * Obtener todos los integrantes
   */
  async obtenerIntegrantes() {
    try {
      const integrantes = await Integrante.findAll({
        order: [['nombre_apellidos', 'ASC']]
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
        INSERT INTO brigadaintegrante (id_brigada, id_integrante)
        VALUES (:id_brigada, :id_integrante)
        ON CONFLICT DO NOTHING
      `, {
        replacements: { id_brigada, id_integrante },
        type: sequelize.QueryTypes.INSERT
      });
      
      return { message: 'Integrante agregado a la brigada' };
    } catch (error) {
      throw new Error('Error al agregar integrante: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas
   */
  async obtenerEstadisticas() {
    try {
      const totalBrigadas = await Brigada.count({ where: { activo: true } });
      const totalIntegrantes = await Integrante.count();
      
      const asignaciones = await sequelize.query(`
        SELECT estado, COUNT(*) as cantidad
        FROM brigadaconglomerado
        GROUP BY estado
      `, {
        type: sequelize.QueryTypes.SELECT
      });
      
      const stats = {
        total_brigadas: totalBrigadas,
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
}

module.exports = new BrigadaService();
