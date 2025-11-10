const Especie = require('../models/Especie');
const { Op } = require('sequelize');

class EspecieService {
  /**
   * Crear nueva especie
   */
  async crearEspecie(data) {
    try {
      const especie = await Especie.create({
        nombre_cientifico: data.nombre_cientifico,
        familia: data.familia || null,
        genero: data.genero || null,
        nombre_comun: data.nombre_comun || null,
        descripcion: data.descripcion || null,
        usos: data.usos || null,
        estado_conservacion: data.estado_conservacion || null
      });
      
      return especie;
    } catch (error) {
      throw new Error('Error al crear especie: ' + error.message);
    }
  }

  /**
   * Obtener todas las especies
   */
  async obtenerTodas(filtros = {}) {
    try {
      const where = {};
      
      if (filtros.busqueda) {
        where[Op.or] = [
          { nombre_cientifico: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { nombre_comun: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { familia: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { genero: { [Op.iLike]: `%${filtros.busqueda}%` } }
        ];
      }

      if (filtros.familia) {
        where.familia = filtros.familia;
      }
      
      const especies = await Especie.findAll({
        where,
        order: [['nombre_cientifico', 'ASC']]
      });
      
      return especies;
    } catch (error) {
      throw new Error('Error al obtener especies: ' + error.message);
    }
  }

  /**
   * Obtener especie por ID
   */
  async obtenerPorId(id) {
    try {
      const especie = await Especie.findByPk(id);
      
      if (!especie) {
        throw new Error('Especie no encontrada');
      }
      
      return especie;
    } catch (error) {
      throw new Error('Error al obtener especie: ' + error.message);
    }
  }

  /**
   * Actualizar especie
   */
  async actualizarEspecie(id, data) {
    try {
      const especie = await Especie.findByPk(id);
      
      if (!especie) {
        throw new Error('Especie no encontrada');
      }
      
      await especie.update(data);
      return especie;
    } catch (error) {
      throw new Error('Error al actualizar especie: ' + error.message);
    }
  }

  /**
   * Eliminar especie
   */
  async eliminarEspecie(id) {
    try {
      const especie = await Especie.findByPk(id);
      
      if (!especie) {
        throw new Error('Especie no encontrada');
      }
      
      await especie.destroy();
      return { message: 'Especie eliminada exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar especie: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas
   */
 async obtenerEstadisticas() {
  try {
    const total = await Especie.count();
    
    return {
      total: total
    };
  } catch (error) {
    throw new Error('Error al obtener estadísticas: ' + error.message);
  }
}
}

module.exports = new EspecieService();
