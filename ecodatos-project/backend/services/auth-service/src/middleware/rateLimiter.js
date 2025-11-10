const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para el endpoint de login
 * Límites relajados para desarrollo/universidad
 */
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos (reducido de 15)
  max: 50, // Máximo 50 intentos por ventana (aumentado de 5)
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 5 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Eliminar keyGenerator personalizado - usar el default
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, intenta nuevamente en 5 minutos.'
    });
  }
});

/**
 * Rate limiter general para endpoints públicos
 * Más permisivo que el de login
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana de tiempo
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP. Por favor, intenta nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  generalLimiter
};
