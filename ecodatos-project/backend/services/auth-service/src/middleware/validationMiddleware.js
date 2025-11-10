const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  next();
};

/**
 * Validaciones para el endpoint de login
 */
const validarLogin = [
  body('usuario')
    .trim()
    .notEmpty().withMessage('El usuario es requerido'),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es requerida'),

  handleValidationErrors
];

/**
 * Validaciones para el endpoint de registro
 */
const validarRegistro = [
  body('usuario')
    .trim()
    .notEmpty().withMessage('El usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('El usuario solo puede contener letras, números, guiones y puntos'),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

  body('tipo_usuario')
    .notEmpty().withMessage('El tipo de usuario es requerido')
    .isIn(['admin', 'coordinador', 'jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador', 'laboratorio'])
    .withMessage('Tipo de usuario no válido'),

  body('id_integrante')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de integrante debe ser un número entero positivo'),

  handleValidationErrors
];

/**
 * Validaciones para crear usuario (endpoint de admin)
 */
const validarCrearUsuario = [
  body('usuario')
    .trim()
    .notEmpty().withMessage('El usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('El usuario solo puede contener letras, números, guiones y puntos'),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('tipo_usuario')
    .notEmpty().withMessage('El tipo de usuario es requerido')
    .isIn(['admin', 'coordinador', 'jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador', 'laboratorio'])
    .withMessage('Tipo de usuario no válido'),

  body('id_integrante')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de integrante debe ser un número entero positivo'),

  body('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser un valor booleano'),

  handleValidationErrors
];

/**
 * Validaciones para editar usuario
 */
const validarEditarUsuario = [
  body('usuario')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('El usuario solo puede contener letras, números, guiones y puntos'),

  body('contrasena')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('tipo_usuario')
    .optional()
    .isIn(['admin', 'coordinador', 'jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador', 'laboratorio'])
    .withMessage('Tipo de usuario no válido'),

  body('id_integrante')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de integrante debe ser un número entero positivo'),

  body('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser un valor booleano'),

  handleValidationErrors
];

module.exports = {
  validarLogin,
  validarRegistro,
  validarCrearUsuario,
  validarEditarUsuario,
  handleValidationErrors
};
