const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar JWT en las peticiones
 */
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Extraer token (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar datos del usuario al request
    req.usuario = {
      id: decoded.id,
      usuario: decoded.usuario,
      tipo_usuario: decoded.tipo_usuario
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

/**
 * Middleware para verificar que el usuario sea admin
 */
const esAdmin = (req, res, next) => {
  if (req.usuario.tipo_usuario !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario sea coordinador o admin
 */
const esCoordinadorOAdmin = (req, res, next) => {
  if (!['admin', 'coordinador'].includes(req.usuario.tipo_usuario)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de coordinador o administrador.'
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario sea jefe de brigada
 */
const esJefeBrigada = (req, res, next) => {
  if (req.usuario.tipo_usuario !== 'jefe_brigada') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Solo los jefes de brigada pueden realizar esta acción.'
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario pueda gestionar especies
 * (admin, coordinador, laboratorio, botanico)
 */
const puedeGestionarEspecies = (req, res, next) => {
  if (!['admin', 'coordinador', 'laboratorio', 'botanico'].includes(req.usuario.tipo_usuario)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador, coordinador, laboratorio o botánico.'
    });
  }
  next();
};

module.exports = {
  verificarToken,
  esAdmin,
  esCoordinadorOAdmin,
  esJefeBrigada,
  puedeGestionarEspecies
};
