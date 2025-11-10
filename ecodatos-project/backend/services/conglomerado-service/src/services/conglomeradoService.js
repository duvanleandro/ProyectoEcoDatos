const Conglomerado = require('../models/Conglomerado');
const Subparcela = require('../models/Subparcela');
const { generarPuntoAleatorio, calcularSubparcelas } = require('../utils/geoUtils');
const axios = require('axios');

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
   * Cambiar estado del conglomerado
   * Si cambia a En_Proceso -> Crea observación automática con hora_inicio
   * Si cambia a Completado -> Actualiza observación con hora_fin
   */
    async cambiarEstado(id, nuevoEstado) {
    try {
      const conglomerado = await Conglomerado.findByPk(id);
      
      if (!conglomerado) {
        throw new Error('Conglomerado no encontrado');
      }

      // VALIDACIÓN: Si intenta cambiar a En_Proceso
      if (nuevoEstado === 'En_Proceso') {
        // 1. Verificar que no tengan otro en proceso
        const enProcesoExistente = await Conglomerado.findOne({
          where: {
            brigada_id: conglomerado.brigada_id,
            estado: 'En_Proceso'
          }
        });

        if (enProcesoExistente && enProcesoExistente.id !== id) {
          throw new Error(`Ya existe un conglomerado en proceso (${enProcesoExistente.nombre}). Completa ese trabajo antes de iniciar otro.`);
        }

// 2. Verificar que no tengan observaciones completadas sin enviar
        try {
          const responseCompletados = await axios.get(`http://localhost:3002/api/conglomerados`, {
            headers: {
              'x-internal-service': 'true'
            }
          });
          const completados = responseCompletados.data.data.filter(
            c => c.brigada_id === conglomerado.brigada_id && c.estado === 'Completado'
          );

          for (const comp of completados) {
            try {
              const responseObs = await axios.get(`http://localhost:3005/api/observaciones/conglomerado/${comp.id}`, {
                headers: {
                  'x-internal-service': 'true'
                }
              });
              
              if (responseObs.data.success && responseObs.data.data.length > 0) {
                const obs = responseObs.data.data[0];

                // SOLO bloquear si hay observación pero NO ha sido validada por jefe
                if (!obs.validado_por_jefe) {
                  throw new Error(`Debes completar y enviar el formulario del conglomerado "${comp.nombre}" antes de iniciar otro.`);
                }
              } else {
                // Si no hay observación, solo registrar warning pero NO bloquear
                console.warn(`⚠️ El conglomerado "${comp.nombre}" está completado sin observación registrada`);
              }
            } catch (obsError) {
              if (obsError.message.includes('Debes completar')) {
                throw obsError; // Solo re-lanzar si hay observación sin validar
              }
              // Si hay error al buscar observaciones (404, etc), continuar
              console.warn(`No se pudo verificar observación para conglomerado ${comp.id}:`, obsError.message);
            }
          }
        } catch (error) {
          if (error.message.includes('Debes completar')) {
            throw error; // Solo re-lanzar el error si hay observación sin validar
          }
          console.warn('Error al verificar observaciones completadas:', error.message);
        }
      }

      const estadoAnterior = conglomerado.estado;
      conglomerado.estado = nuevoEstado;

      // Registrar fecha de inicio cuando cambia a En_Proceso
      if (nuevoEstado === 'En_Proceso' && estadoAnterior === 'Asignado') {
        conglomerado.fecha_inicio = new Date();
        console.log(`📅 Registrando fecha_inicio: ${conglomerado.fecha_inicio}`);
      }

      await conglomerado.save();
      console.log(`✅ Estado cambiado de "${estadoAnterior}" a "${nuevoEstado}" para conglomerado ${id}`);

      // LÓGICA AUTOMÁTICA: Crear/Actualizar observación
      if (nuevoEstado === 'En_Proceso' && estadoAnterior === 'Asignado') {
        // Crear observación automática con hora_inicio
        try {
          const horaActual = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

          await axios.post('http://localhost:3005/api/observaciones', {
            id_conglomerado: conglomerado.id,
            id_brigada: conglomerado.brigada_id,
            fecha_observacion: new Date().toISOString().split('T')[0],
            hora_inicio: horaActual,
            registrado_por: 1 // TODO: Obtener del contexto
          }, {
            headers: {
              'x-internal-service': 'true'
            }
          });

          console.log(`✅ Observación creada automáticamente para conglomerado ${id}`);
        } catch (error) {
          console.error('Error al crear observación automática:', error.message);
          // No lanzar error para no bloquear el cambio de estado
        }
      }

      if (nuevoEstado === 'Completado' && estadoAnterior === 'En_Proceso') {
        // Actualizar observación con hora_fin
        try {
          const horaActual = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

          // Buscar la observación del conglomerado
          const responseObs = await axios.get(`http://localhost:3005/api/observaciones/conglomerado/${id}`, {
            headers: {
              'x-internal-service': 'true'
            }
          });

          if (responseObs.data.success && responseObs.data.data.length > 0) {
            const observacion = responseObs.data.data[0];

            // Actualizar con hora_fin
            await axios.put(`http://localhost:3005/api/observaciones/${observacion.id}`, {
              hora_fin: horaActual
            }, {
              headers: {
                'x-internal-service': 'true'
              }
            });

            console.log(`✅ Observación actualizada con hora_fin para conglomerado ${id}`);
          }
        } catch (error) {
          console.error('Error al actualizar observación con hora_fin:', error.message);
          // No lanzar error para no bloquear el cambio de estado
        }
      }
      
      return conglomerado;
    } catch (error) {
      throw new Error('Error al cambiar estado: ' + error.message);
    }
  }


  /**
   * Eliminar conglomerado
   */
  async eliminarConglomerado(id) {
    try {
      const conglomerado = await Conglomerado.findByPk(id);
      
      if (!conglomerado) {
        throw new Error('Conglomerado no encontrada');
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
      const en_proceso = await Conglomerado.count({ where: { estado: 'En_Proceso' } });
      const completados = await Conglomerado.count({ where: { estado: 'Completado' } });
      
      return {
        total,
        pendientes,
        aprobados,
        rechazados,
        asignados,
        en_proceso,
        completados
      };
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }

  /**
   * Obtener conglomerado activo (En_Proceso) de una brigada
   */
  async obtenerActivoPorBrigada(brigadaId) {
    try {
      const { sequelize } = require('../config/database');
      const axios = require('axios');

      // Buscar conglomerado en estado "En_Proceso" para la brigada
      const conglomerados = await sequelize.query(`
        SELECT c.*,
               COUNT(sp.id) as total_subparcelas
        FROM conglomerado c
        LEFT JOIN subparcela sp ON c.id = sp.id_conglomerado
        WHERE c.brigada_id = :brigadaId
          AND c.estado = 'En_Proceso'
        GROUP BY c.id
        LIMIT 1
      `, {
        replacements: { brigadaId: parseInt(brigadaId) },
        type: sequelize.QueryTypes.SELECT
      });

      const conglomerado = conglomerados[0];

      if (!conglomerado) {
        return null; // No hay conglomerado activo
      }

      // Obtener observaciones del conglomerado
      try {
        const responseObs = await axios.get(
          `http://localhost:3005/api/observaciones/conglomerado/${conglomerado.id}`,
          {
            headers: {
              'x-internal-service': 'true'
            }
          }
        );

        conglomerado.observaciones = responseObs.data.success
          ? responseObs.data.data
          : [];
        conglomerado.total_observaciones = conglomerado.observaciones.length;
      } catch (error) {
        console.error('Error al obtener observaciones:', error.message);
        conglomerado.observaciones = [];
        conglomerado.total_observaciones = 0;
      }

      return conglomerado;
    } catch (error) {
      throw new Error('Error al obtener conglomerado activo: ' + error.message);
    }
  }
}

module.exports = new ConglomeradoService();
