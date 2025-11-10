import axios from 'axios';

/**
 * Configuración global de Axios con interceptores
 */

// Interceptor de request - Agrega token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Maneja errores globalmente
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TEMPORALMENTE DESACTIVADO - Solo logueamos errores en consola
    // Para desarrollo/testing es mejor no cerrar sesión automáticamente

    if (error.response?.status === 401) {
      console.warn('⚠️ Error 401 - Unauthorized:', error.response?.data?.message || 'Sin mensaje');
      console.warn('URL:', error.config?.url);
    }

    if (error.response?.status === 403) {
      console.warn('❌ Error 403 - Forbidden:', error.response?.data?.message);
    }

    if (error.response?.status === 500) {
      console.error('💥 Error 500 - Server Error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default axios;
