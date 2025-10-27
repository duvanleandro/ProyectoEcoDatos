const authService = require('../services/authService');

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
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: resultado
      });
    } catch (error) {
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
}

module.exports = new AuthController();
