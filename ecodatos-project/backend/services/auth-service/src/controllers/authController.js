const authService = require('../services/authService');
const auditLogger = require('../middleware/auditLogger');

class AuthController {
  async register(req, res) {
    try {
      const usuario = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: usuario
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { usuario, contrasena } = req.body;
      const resultado = await authService.login(usuario, contrasena);

      // Registrar login exitoso en auditoría
      const ipAddress = req.ip || req.connection.remoteAddress;
      await auditLogger.log(resultado.usuario.id, 'login', 'usuario', resultado.usuario.id, null, ipAddress);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: resultado
      });
    } catch (error) {
      // Registrar intento fallido de login
      const ipAddress = req.ip || req.connection.remoteAddress;
      await auditLogger.log(null, 'login_failed', 'usuario', null, { usuario: req.body.usuario }, ipAddress);

      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async verificar(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const decoded = await authService.verificarToken(token);
      res.status(200).json({
        success: true,
        data: decoded
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/auth/crear-usuario (solo admin)
   */
  async crearUsuario(req, res) {
    try {
      // El middleware ya verificó el token y agregó req.usuario
      const usuario = await authService.crearUsuario(req.body, req.usuario.id);
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: usuario
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/usuarios (solo admin)
   */
  async listarUsuarios(req, res) {
    try {
      const usuarios = await authService.listarUsuarios(req.usuario.id);
      
      res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/auth/usuarios/:id (solo admin)
   */
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;
      const resultado = await authService.eliminarUsuario(id, req.usuario.id);
      
      res.status(200).json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/estadisticas
   */
  async estadisticas(req, res) {
    try {
      const stats = await authService.obtenerEstadisticas();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/auth/usuarios/:id
   */
  async editarUsuario(req, res) {
    try {
      const { id } = req.params;
      const resultado = await authService.editarUsuario(id, req.body, req.usuario.id);
      
      res.json({
        success: true,
        message: resultado.message,
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PATCH /api/auth/usuarios/:id/toggle-activo
   */
  async toggleActivarUsuario(req, res) {
    try {
      const { id } = req.params;
      const resultado = await authService.toggleActivarUsuario(id, req.usuario.id);

      res.json({
        success: true,
        message: resultado.message,
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/auth/cambiar-contrasena
   * Cambiar contraseña del usuario autenticado
   */
  async cambiarContrasena(req, res) {
    try {
      const { contrasenaActual, contrasenaNueva } = req.body;
      const resultado = await authService.cambiarContrasena(
        req.usuario.id,
        contrasenaActual,
        contrasenaNueva
      );

      res.json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/auth/restablecer-contrasena/:id
   * Restablecer contraseña de un usuario (solo admin)
   */
  async restablecerContrasena(req, res) {
    try {
      const { id } = req.params;
      const { nuevaContrasena } = req.body;
      const resultado = await authService.restablecerContrasena(
        id,
        nuevaContrasena,
        req.usuario.id
      );

      res.json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/perfil
   * Obtener perfil del usuario autenticado
   */
  async obtenerPerfil(req, res) {
    try {
      const perfil = await authService.obtenerPerfil(req.usuario.id);

      res.json({
        success: true,
        data: perfil
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/logs
   * Obtener logs de auditoría (solo admin)
   */
  async obtenerLogs(req, res) {
    try {
      const filtros = {
        usuarioId: req.query.usuarioId,
        accion: req.query.accion,
        entidad: req.query.entidad,
        fechaInicio: req.query.fechaInicio,
        fechaFin: req.query.fechaFin,
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
      };

      const logs = await auditLogger.obtenerLogs(filtros);

      res.json({
        success: true,
        data: logs,
        filtros
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/auth/logs/estadisticas
   * Obtener estadísticas de auditoría (solo admin)
   */
  async obtenerEstadisticasLogs(req, res) {
    try {
      const stats = await auditLogger.obtenerEstadisticas();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
