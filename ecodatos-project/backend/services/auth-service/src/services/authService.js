const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthService {
  async register(usuarioData) {
    const { usuario, contrasena, tipo_usuario, id_integrante } = usuarioData;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { usuario } });
    if (existeUsuario) {
      throw new Error('El usuario ya existe');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario - nota: usamos 'contraseña' con ñ para la BD
    const nuevoUsuario = await Usuario.create({
      usuario,
      contraseña: hashedPassword,
      tipo_usuario: tipo_usuario || 'brigadista',
      id_integrante
    });

    return {
      id: nuevoUsuario.id,
      usuario: nuevoUsuario.usuario,
      tipo_usuario: nuevoUsuario.tipo_usuario
    };
  }

  async login(usuario, contrasena) {
    // Buscar usuario
    const usuarioEncontrado = await Usuario.findOne({ 
      where: { usuario, activo: true } 
    });

    if (!usuarioEncontrado) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña - accedemos con 'contraseña' con ñ
    const passwordValida = await bcrypt.compare(contrasena, usuarioEncontrado.contraseña);
    if (!passwordValida) {
      throw new Error('Credenciales inválidas');
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        tipo_usuario: usuarioEncontrado.tipo_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        tipo_usuario: usuarioEncontrado.tipo_usuario
      }
    };
  }

  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = new AuthService();
