import axios from '../config/axios';
import { API_CONFIG, ENDPOINTS } from '../config/api';

const API_URL = `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}`;

export const observacionService = {
  // Crear observación
  crear: async (datos) => {
    const response = await axios.post(API_URL, datos);
    return response.data;
  },

  // Obtener todas
  obtenerTodas: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  },

  // Obtener por conglomerado
  obtenerPorConglomerado: async (idConglomerado) => {
    const response = await axios.get(`${API_URL}/conglomerado/${idConglomerado}`);
    return response.data;
  },

  // Obtener por brigada
  obtenerPorBrigada: async (idBrigada) => {
    const response = await axios.get(`${API_URL}/brigada/${idBrigada}`);
    return response.data;
  },

  // Obtener por ID
  obtenerPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Actualizar
  actualizar: async (id, datos) => {
    const response = await axios.put(`${API_URL}/${id}`, datos);
    return response.data;
  },

  // Validar
  validar: async (id, idUsuario) => {
    const response = await axios.put(`${API_URL}/${id}/validar`, { idUsuario });
    return response.data;
  },

  // Eliminar
  eliminar: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Estadísticas
  obtenerEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/estadisticas`);
    return response.data;
  }
};
