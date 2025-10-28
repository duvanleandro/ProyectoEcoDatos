const Conglomerado = require('../models/Conglomerado');
const Subparcela = require('../models/Subparcela');
const { generarPuntoAleatorio, calcularSubparcelas } = require('../utils/geoUtils');

class ConglomeradoService {
  /**
   * Genera múltiples conglomerados aleatorios
   */
  async generarConglomerados(cantidad = 50) {
    try {
      const conglomeradosGenerados = [];
      
      for (let i = 0; i < cantidad; i++) {
        const punto = generarPuntoAleatorio();
        
        const conglomerado = await Conglomerado.create({
          nombre: `Conglomerado ${Date.now()}-${i}`,
          ubicacion: `${punto.latitud}, ${punto.longitud}`,
          latitud: punto.latitud,
          longitud: punto.longitud,
          estado: 'Pendiente',
          municipio: 'Por determinar',
          departamento: 'Por determinar'
        });
        
        conglomeradosGenerados.push(conglomerado);
      }
      
      return conglomeradosGenerados;
    } catch (error) {
      throw new Error('Error al generar conglomerados: ' + error.message);
    }
  }

  /**
   * Obtener todos los conglomerados
   */
  async obtenerTodos(filtros = {}) {
    try {
      const where = {};
      
      if (filtros.estado) {
        where.estado = filtros.estado;
      }
      
      const conglomerados = await Conglomerado.findAll({
        where,
        order: [['id', 'DESC']]
      });
      
      return conglomerados;
    } catch (error) {
      throw new Error('Error al obtener conglomerados: ' + error.message);
    }
  }

  /**
   * Obtener un conglomerado por ID con sus subparcelas
   */
  async obtenerPorId(id) {
    try {
      const conglomerado = await Conglomerado.findByPk(id);
      
      if (!conglomerado) {
        throw new Error('Conglomerado no encontrado');
      }
      
      const subparcelas = await Subparcela.findAll({
        where: { id_conglomerado: id },
        order: [['numero', 'ASC']]
      });
      
      return {
        ...conglomerado.toJSON(),
        subparcelas
      };
    } catch (error) {
      throw new Error('Error al obtener conglomerado: ' + error.message);
    }
  }

  /**
   * Aprobar conglomerado y crear subparcelas automáticamente
   */
  async aprobarConglomerado(id) {
    try {
      const conglomerado = await Conglomerado.findByPk(id);
      
      if (!conglomerado) {
        throw new Error('Conglomerado no encontrado');
      }
      
      if (conglomerado.estado !== 'Pendiente') {
        throw new Error('El conglomerado ya fue procesado');
      }
      
      // Calcular las 5 subparcelas
      const subparcelas = calcularSubparcelas(
        parseFloat(conglomerado.latitud),
        parseFloat(conglomerado.longitud)
      );
      
      // Guardar subparcelas en la base de datos
      for (const sp of subparcelas) {
        await Subparcela.create({
          id_conglomerado: id,
          numero: sp.numero,
          nombre: sp.nombre,
          coordenadas: sp.coordenadas,
          latitud: sp.latitud,
          longitud: sp.longitud
        });
      }
      
      // Actualizar estado del conglomerado
      conglomerado.estado = 'Aprobado';
      conglomerado.fecha_aprobacion = new Date();
      await conglomerado.save();
      
      return {
        conglomerado,
        subparcelas
      };
    } catch (error) {
      throw new Error('Error al aprobar conglomerado: ' + error.message);
    }
  }

  /**
   * Rechazar conglomerado
   */
  async rechazarConglomerado(id) {
    try {
      const conglomerado = await Conglomerado.findByPk(id);
      
      if (!conglomerado) {
        throw new Error('Conglomerado no encontrado');
      }
      
      if (conglomerado.estado !== 'Pendiente') {
        throw new Error('El conglomerado ya fue procesado');
      }
      
      conglomerado.estado = 'Rechazado';
      await conglomerado.save();
      
      return conglomerado;
    } catch (error) {
      throw new Error('Error al rechazar conglomerado: ' + error.message);
    }
  }

  /**
   * Eliminar conglomerado
   */
  async eliminarConglomerado(id) {
    try {
      const conglomerado = await Conglomerado.findByPk(id);
      
      if (!conglomerado) {
        throw new Error('Conglomerado no encontrado');
      }
      
      // Eliminar subparcelas asociadas primero
      await Subparcela.destroy({ where: { id_conglomerado: id } });
      
      // Eliminar conglomerado
      await conglomerado.destroy();
      
      return { message: 'Conglomerado eliminado exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar conglomerado: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas
   */
  async obtenerEstadisticas() {
    try {
      const total = await Conglomerado.count();
      const pendientes = await Conglomerado.count({ where: { estado: 'Pendiente' } });
      const aprobados = await Conglomerado.count({ where: { estado: 'Aprobado' } });
      const rechazados = await Conglomerado.count({ where: { estado: 'Rechazado' } });
      const asignados = await Conglomerado.count({ where: { estado: 'Asignado' } });
      const completados = await Conglomerado.count({ where: { estado: 'Completado' } });
      
      return {
        total,
        pendientes,
        aprobados,
        rechazados,
        asignados,
        completados
      };
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }
}

module.exports = new ConglomeradoService();
