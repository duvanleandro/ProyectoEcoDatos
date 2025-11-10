/**
 * Configuración centralizada de URLs de API
 * Usa variables de entorno de Vite
 */

export const API_CONFIG = {
  AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  CONGLOMERADO_SERVICE: import.meta.env.VITE_CONGLOMERADO_SERVICE_URL || 'http://localhost:3002',
  BRIGADA_SERVICE: import.meta.env.VITE_BRIGADA_SERVICE_URL || 'http://localhost:3003',
  ESPECIE_SERVICE: import.meta.env.VITE_ESPECIE_SERVICE_URL || 'http://localhost:3004',
  OBSERVACION_SERVICE: import.meta.env.VITE_OBSERVACION_SERVICE_URL || 'http://localhost:3005',
  GATEWAY: import.meta.env.VITE_GATEWAY_URL || 'http://localhost:4000',
};

/**
 * Helper para construir URLs completas
 */
export const getApiUrl = (service, endpoint) => {
  const baseUrl = API_CONFIG[service];
  return `${baseUrl}${endpoint}`;
};

/**
 * URLs de endpoints comunes
 */
export const ENDPOINTS = {
  // Auth Service
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY: '/api/auth/verify',
    USUARIOS: '/api/auth/usuarios',
    CREAR_USUARIO: '/api/auth/crear-usuario',
    ESTADISTICAS: '/api/auth/estadisticas',
    PERFIL: '/api/auth/perfil',
    CAMBIAR_CONTRASENA: '/api/auth/cambiar-contrasena',
    RESTABLECER_CONTRASENA: (id) => `/api/auth/restablecer-contrasena/${id}`,
  },

  // Conglomerado Service
  CONGLOMERADO: {
    BASE: '/api/conglomerados',
    GENERAR: '/api/conglomerados/generar',
    ESTADISTICAS: '/api/conglomerados/estadisticas',
    BRIGADA_ACTIVO: (brigadaId) => `/api/conglomerados/brigada/${brigadaId}/activo`,
  },

  // Brigada Service
  BRIGADA: {
    BASE: '/api/brigadas',
    INTEGRANTES: '/api/brigadas/integrantes',
    ESTADISTICAS: '/api/brigadas/estadisticas',
    USUARIO: (userId) => `/api/brigadas/usuario/${userId}`,
    CONGLOMERADOS: (brigadaId) => `/api/brigadas/${brigadaId}/conglomerados`,
  },

  // Especie Service
  ESPECIE: {
    BASE: '/api/especies',
    ESTADISTICAS: '/api/especies/estadisticas',
  },

  // Observacion Service
  OBSERVACION: {
    BASE: '/api/observaciones',
    CONGLOMERADO: (id) => `/api/observaciones/conglomerado/${id}`,
    BRIGADA: (id) => `/api/observaciones/brigada/${id}`,
    FOTOS: (id) => `/api/observaciones/${id}/fotos`,
  },
};

export default API_CONFIG;
